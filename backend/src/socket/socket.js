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

    await People.findByIdAndUpdate(userOid, { active: true });
    socket.on("disconnect", async () => {
      await People.findByIdAndUpdate(userOid, { active: true });
    });
  });
};
