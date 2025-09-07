// backend/server.js
import express from "express";
import http from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { Server } from "socket.io";

// Routes
import authRoutes from "./routes/auth.js";
import companyRoutes from "./routes/company.js";
import locationRoutes from "./routes/location.js";
import employeeRoutes from "./routes/employeeRoutes.js";

// Config
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// MongoDB connection
await connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/employees", employeeRoutes);

// Create HTTP server + Socket.IO
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
app.set("io", io);

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  // client should emit 'join-company' with companyId to join that room
  socket.on("join-company", (companyId) => {
    socket.join(companyId);
    console.log(socket.id, "joined", companyId);
  });

  socket.on("disconnect", () => {
    console.log("socket disconnected", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
