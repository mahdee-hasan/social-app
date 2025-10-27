// external imports
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";

// internal imports

import connectDB from "./config/db.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import authRouter from "./routes/auth.routes.js";
import inboxRouter from "./routes/inbox.routes.js";
import usersRouter from "./routes/users.routes.js";
import feedsRouter from "./routes/feeds.routes.js";
import userRouter from "./routes/user.routes.js";
import { setupSocket } from "./socket/socket.js";
// app
const app = express();
const server = http.createServer(app);
const allowedOrigins = [process.env.ALLOWED_ORIGIN];

// CORS for HTTP routes
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// connect to MongoDB
connectDB();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

// routes
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/inbox", inboxRouter);
app.use("/api/feeds", feedsRouter);
app.use("/api/user", userRouter);

// error handling
app.use(notFoundHandler);
app.use(errorHandler);

setupSocket(server, allowedOrigins);
// listen
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`port ${PORT} in ${process.env.NODE_ENV}`);
});
