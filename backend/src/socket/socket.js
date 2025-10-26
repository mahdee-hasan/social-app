import { Server } from "socket.io";

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

    console.log("connected", userOid);
    socket.on("disconnect", async () => {
      console.log("disconnected", userOid);
    });
  });

  console.log("🔥 Socket.IO initialized with Firebase auth");
};
