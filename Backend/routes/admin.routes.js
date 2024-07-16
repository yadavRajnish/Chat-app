import express from "express";
import {
  adminLogin,
  adminLogout,
  allChats,
  allMessages,
  allUsers,
  getAdminData,
  getDashboardStats,
} from "../controllers/admin.controller.js";
import { adminLoginValidator, validatorHandlers } from "../lib/validators.js";
import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();

app.post("/verify", adminLoginValidator(), validatorHandlers, adminLogin);

app.get("/logout", adminLogout);

// Only Admin Can Accecss these Routes
app.use(adminOnly);

app.get("/", getAdminData);

app.get("/users", allUsers);

app.get("/chats", allChats);
app.get("/messages", allMessages);

app.get("/stats", getDashboardStats);

export default app;
