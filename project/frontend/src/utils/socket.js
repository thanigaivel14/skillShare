// src/socket.js
import { io } from "socket.io-client";

const socket = io("localhost:8000", {
    transports: ["websocket"],
  withCredentials: true,
});

export default socket;
