import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectRouter from "./Components/auth/ProtectRouter";
import { LoaderLayout } from "./Components/layout/Loaders";
import axios from "axios";
import { server } from "./constant/config";
import { useDispatch, useSelector } from "react-redux";
import { userExists, userNotExists } from "./redux/reducers/auth";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "./socket.jsx";

const Home = lazy(() => import("./Pages/Home"));
const Login = lazy(() => import("./Pages/Login"));
const Chat = lazy(() => import("./Pages/Chat"));
const Groups = lazy(() => import("./Pages/Groups"));
const NotFound = lazy(() => import("./Pages/NotFound"));

const AdminLogin = lazy(() => import("./Pages/Admin/AdminLogin"));
const Dashboard = lazy(() => import("./Pages/Admin/Dashboard"));
const UserManagement = lazy(() => import("./Pages/Admin/UserManagement"));
const ChatManagement = lazy(() => import("./Pages/Admin/ChatManagement"));
const MessageManagement = lazy(() => import("./Pages/Admin/MessageManagement"));

const App = () => {
  const { user, loader } = useSelector((state) => state.auth);

  const disptach = useDispatch();

  useEffect(() => {
    axios
      .get(`${server}/api/v1/user/me`, { withCredentials: true })
      .then(({ data }) => disptach(userExists(data.user)))
      .catch((err) => disptach(userNotExists()));
  }, [disptach]);

  return loader ? (
    <LoaderLayout />
  ) : (
    <BrowserRouter>
      <Suspense fallback={<LoaderLayout />}>
        <Routes>
          <Route
            element={
              <SocketProvider>
                <ProtectRouter user={user} />
              </SocketProvider>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/chat/:chatId" element={<Chat />} />
            <Route path="/groups" element={<Groups />} />
          </Route>

          {/* <Route path="/login" element={<Login />} /> */}

          <Route
            path="/login"
            element={
              <ProtectRouter user={!user} redirect="/">
                <Login />
              </ProtectRouter>
            }
          />

          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/chats" element={<ChatManagement />} />
          <Route path="/admin/messages" element={<MessageManagement />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster position="bottom-center" />
    </BrowserRouter>
  );
};

export default App;
