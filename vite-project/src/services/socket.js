import { io } from "socket.io-client";

// Hardcode backend URL here (works in frontend)
const WS_URL = "http://localhost:5000"; // replace with your backend server

const socket = io(WS_URL, {
  autoConnect: false, // connect manually
});

export default socket;
