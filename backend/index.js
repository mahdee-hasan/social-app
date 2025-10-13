// external imports
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

// internal imports
const { connectDB } = require("./config/db");
const people = require("./models/people");
const {
  errorHandler,
  notFoundHandler,
} = require("./middleware/common/errorHandler");
const authRouter = require("./router/authRouter");
const inboxRouter = require("./router/inboxRouter");
const usersRouter = require("./router/usersRouter");
const feedsRouter = require("./router/feedsRouter");
const userRouter = require("./router/userRouter");
const conversation = require("./models/conversation");

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

// CORS for socket.io
const io = require("socket.io")(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

global.io = io;
// connect to MongoDB
connectDB();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
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

//for active and non-active
io.on("connection", async (socket) => {
  try {
    const cookieHeader = socket.handshake.headers.cookie;

    if (cookieHeader) {
      // Convert cookie string into an object: { cookieName1: value1, cookieName2: value2 }
      const cookies = Object.fromEntries(
        cookieHeader.split("; ").map((c) => {
          const [key, ...v] = c.split("=");
          return [key, decodeURIComponent(v.join("="))];
        })
      );

      let token = cookies[process.env.REFRESH_TOKEN_COOKIE_NAME];
      if (token?.startsWith("s:")) {
        token = token.slice(2); // "s:" বাদ দাও
      }
      token = token.split(".").slice(0, 3).join(".");

      if (token) {
        // Verify JWT using your access token secret
        const userData = jwt.verify(
          token,
          process.env.JWT_REFRESH_TOKEN_SECRET
        );

        if (userData?.userId) {
          socket.userId = userData.userId;
          socket.username = userData.username;

          // Mark user as active in DB
          await people.findByIdAndUpdate(socket.userId, {
            $set: { active: true },
          });
        }
      }
    }
  } catch (err) {
    console.error("Socket connection error:", err.message);
  }

  // On disconnect
  socket.on("disconnect", async () => {
    try {
      if (socket.userId) {
        await people.updateOne(
          { _id: socket.userId },
          { $set: { active: false } }
        );
      }

      if (socket.username) {
        await conversation.updateMany(
          { isOpen: socket.username },
          { $pull: { isOpen: socket.username } }
        );
      }
    } catch (err) {
      console.error("Socket disconnect error:", err.message);
    }
  });
});

// listen
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
