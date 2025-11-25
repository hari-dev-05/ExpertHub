// src/Community/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

const socket = io(SOCKET_URL, { autoConnect: false });

export const connectSocket = (userId) => {
  if (!socket.connected) {
    socket.connect();
    socket.emit("join", userId); // join global socket room
    console.log(`🔗 Socket connected for user: ${userId}`);
  }
};

// Disconnect socket
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
    console.log("🔌 Socket disconnected");
  }
};

export const sendMessage = ({ senderId, receiverId, text }) => {
  socket.emit("sendMessage", { senderId, receiverId, text });
};

export const subscribeToMessages = (callback) => {
  socket.on("receiveMessage", callback);
};

export const unsubscribeFromMessages = () => {
  socket.off("receiveMessage");
};

export default socket;
