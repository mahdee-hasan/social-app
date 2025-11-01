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
    try {
      await People.findByIdAndUpdate(userOid, { active: true });
    } catch (error) {
      console.log(error.message);
    }

    socket.on("disconnect", async () => {
      try {
        await People.findByIdAndUpdate(socket.userOid, { active: false });
      } catch (error) {
        console.log(error.message);
      }
    });
  });
};
