// src/socket.js
import { io } from "socket.io-client";

const socket = io("https://skillshare-1j86.onrender.com", {
    transports: ["websocket"],
  withCredentials: true,
});

export default socket;
