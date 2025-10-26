// src/socket.js
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL, {
  autoConnect: false, // 🚫 Don't connect immediately
  withCredentials: true,
});

export default socket;
