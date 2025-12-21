import { Server } from "socket.io";
import People from "./../models/people.model.js";
export const setupSocket = (server, allowedOrigins) => {
  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  global.io = io;

  io.on("connection", async (socket) => {
    // Handle disconnect
    const { userOid } = socket.handshake.query;
    socket.userOid = userOid;
    socket.join(userOid);
    try {
      await People.findByIdAndUpdate(userOid, { active: true });
    } catch (error) {
      console.log(error.message);
    }

    // Join a new conversation room
    socket.on("join_room", ({ roomId, userId }) => {
      socket.join(roomId);
      socket.join(`presence:${roomId}:${userId}`);
    });

    // Leave a room
    socket.on("leave_room", ({ roomId, userId }) => {
      socket.leave(roomId);
      socket.leave(`presence:${roomId}:${userId}`);
    });
    // user is typing in a conversation
    socket.on("typing", ({ roomId, avatar }) => {
      // const count = io.sockets.adapter.rooms.get(roomId)?.size || 0;

      // console.log(`Users in room ${roomId}:`, count);
      socket.to(roomId).emit("isTyping", { avatar });
    });

    socket.on("disconnect", async () => {
      try {
        await People.findByIdAndUpdate(socket.userOid, { active: false });
        socket.leave(socket.userOid);
      } catch (error) {
        console.log(error.message);
      }
    });
  });
};
