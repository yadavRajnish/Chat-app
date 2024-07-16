import { compare } from "bcrypt";
import { userModel } from "../models/user.model.js";
import {
  cookieOptions,
  emitEvent,
  sendToken,
  uploadFileToCloudinary,
} from "../utils/features.js";
import { TryCatch } from "../middlewares/error.js";
import { chatModel } from "../models/chat.model.js";
import { requestMdoel } from "../models/request.model.js";
import { ErrorHandler } from "../utils/utility.js";
import { NEW_REQUEST, REFETCH_CHATS } from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";

//Create a new user and save it to the database and save in cookies
const newUser = TryCatch(async (req, res, next) => {
  const { name, username, password, bio } = req.body;

  const file = req.file;
  if (!file) return next(new ErrorHandler("Please Upload Avatar"));

  const result = await uploadFileToCloudinary([file]);

  const avatar = {
    public_id: result[0].public_id,
    url: result[0].url,
  };

  const user = await userModel.create({
    name,
    bio,
    username,
    password,
    avatar,
  });

  sendToken(res, user, 201, "user created successfully");

  // try {
  //   const user = await userModel.create({
  //     name,
  //     bio,
  //     username,
  //     password,
  //     avatar,
  //   });
  //   sendToken(res, user, 201, "user created successfully");
  // } catch (error) {
  //   res.status(500).json({
  //     message: "server error",
  //     error: error.message,
  //   });
  // }
});

const login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await userModel.findOne({ username }).select("+password");
    if (!user)
      return next(new ErrorHandler("Invalid Username or Password", 404));

    const isMatchPassword = await compare(password, user.password);
    if (!isMatchPassword)
      return next(new ErrorHandler("Invalid Username or Password", 404));

    sendToken(res, user, 200, `Welcome Back, ${user.name}`);
  } catch (error) {
    next(error);
  }
};

const getMyProfile = TryCatch(async (req, res, next) => {
  const user = await userModel.findById(req.user);
  if (!user) return next(new ErrorHandler("User not found", 404));
  res.status(200).json({
    success: true,
    user,
  });
});

const logout = TryCatch(async (req, res, next) => {
  return res
    .status(200)
    .cookie("chat-token", "", { ...cookieOptions, maxAge: 0 })
    .json({
      success: true,
      message: "User logged out",
    });
});

const searchUser = TryCatch(async (req, res, next) => {
  const { name = "" } = req.query;

  //Finging all the users
  const myChats = await chatModel.find({ groupChat: false, members: req.user });
  // extracting all the users from my chats means friends or people i have chatted with
  const allusersFromChats = myChats.flatMap((chat) => chat.members);

  //Finding all the users except me and my friends
  const allUserExceptMeAndFriends = await userModel.find({
    _id: { $nin: allusersFromChats },
    name: { $regex: name, $options: "i" },
  });

  //modifying the response
  const users = allUserExceptMeAndFriends.map(({ _id, name, avatar }) => ({
    _id,
    name,
    avatar: avatar.url,
  }));
  return res.status(200).json({
    success: true,
    users,
  });
});

const sendFriendRequest = TryCatch(async (req, res, next) => {
  const { userId } = req.body;

  const request = await requestMdoel.findOne({
    $or: [
      { sender: req.user, receiver: userId },
      { sender: userId, receiver: req.user },
    ],
  });

  if (request) return next(new ErrorHandler("Request already sent", 400));

  await requestMdoel.create({
    sender: req.user,
    receiver: userId,
  });

  emitEvent(req, NEW_REQUEST, [userId]);

  return res.status(200).json({
    success: true,
    message: "Friend request sent",
  });
});

const acceptFriendRequest = TryCatch(async (req, res, next) => {
  const { requestId, accept } = req.body;

  const request = await requestMdoel
    .findById(requestId)
    .populate("sender", "name")
    .populate("receiver", "name");

  if (!request) return next(new ErrorHandler("Request not found", 404));

  if (request.receiver._id.toString() !== req.user.toString())
    return next(
      new ErrorHandler("You are not authorized to accept this request", 401)
    );

  if (!accept) {
    await request.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Friend Request Rejected",
    });
  }

  const members = [request.sender._id, request.receiver._id];

  await Promise.all([
    chatModel.create({
      members,
      name: `${request.sender.name}-${request.receiver.name}`,
    }),
    request.deleteOne(),
  ]);

  emitEvent(req, REFETCH_CHATS, members);

  return res.status(200).json({
    success: true,
    message: "Friend Request Accepted",
    senderId: request.sender._id,
  });
});

const getMyNotifications = TryCatch(async (req, res) => {
  const requests = await requestMdoel
    .find({ receiver: req.user })
    .populate("sender", "name avatar");

  const allRequests = requests.map(({ _id, sender }) => ({
    _id,
    sender: {
      _id: sender._id,
      name: sender.name,
      avatar: sender.avatar.url,
    },
  }));

  return res.status(200).json({
    success: true,
    allRequests,
  });
});

const getMyFriends = TryCatch(async (req, res) => {
  const chatId = req.query.chatId;

  const chats = await chatModel.find({
      members: req.user,
      groupChat: false,
    }).populate("members", "name avatar");

  const friends = chats.map(({ members }) => {
    const otherUser = getOtherMember(members, req.user);

    return {
      _id: otherUser._id,
      name: otherUser.name,
      avatar: otherUser.avatar.url,
    };
  });

  if (chatId) {
    const chat = await chatModel.findById(chatId);

    const availableFriends = friends.filter(
      (friend) => !chat.members.includes(friend._id)
    );

    return res.status(200).json({
      success: true,
      friends: availableFriends,
    });
  } else {
    return res.status(200).json({
      success: true,
      friends,
    });
  }
});

export {
  newUser,
  login,
  getMyProfile,
  logout,
  searchUser,
  sendFriendRequest,
  acceptFriendRequest,
  getMyNotifications,
  getMyFriends,
};
