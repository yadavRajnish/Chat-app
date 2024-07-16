import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  addMember,
  deleteChat,
  getChatDetails,
  getMessages,
  getMyChats,
  getMyGroup,
  leaveGroup,
  newGroupChat,
  removeMembers,
  renameGroup,
  sendAttachment,
} from "../controllers/chat.controller.js";
import { attachmentsMulter } from "../middlewares/multer.js";
import {
  addMemberValidator,
  chatIdValidator,
  newGroupValidator,
  removeMemberValidator,
  renameValidator,
  sendAttachmentsValidator,
  validatorHandlers,
} from "../lib/validators.js";

const app = express.Router();

app.use(isAuthenticated);

app.post("/new", newGroupValidator(), validatorHandlers, newGroupChat);

app.get("/my", getMyChats);

app.get("/my/groups", getMyGroup);

app.put("/addmembers", addMemberValidator(), validatorHandlers, addMember);

app.put(
  "/removemember",
  removeMemberValidator(),
  validatorHandlers,
  removeMembers
);

app.delete("/leave/:id", chatIdValidator(), validatorHandlers, leaveGroup);

// Send Attachment
app.post(
  "/message",
  attachmentsMulter,
  sendAttachmentsValidator(),
  validatorHandlers,
  sendAttachment
);

// get Messages
app.get("/message/:id", chatIdValidator(), validatorHandlers, getMessages);

// Get Chat Details, remove , delete
app
  .route("/:id")
  .get(chatIdValidator(), validatorHandlers, getChatDetails)
  .put(renameValidator(), validatorHandlers, renameGroup)
  .delete(chatIdValidator(), validatorHandlers, deleteChat);

export default app;
