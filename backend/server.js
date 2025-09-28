import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import http from "http";
import { Server } from "socket.io";

const app = express();
app.use(cors());
app.use(express.json());

// Wrap Express server with HTTP for socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }, // allow frontend
});

let jobs = []; // in-memory job store

// Create a job
app.post("/jobs", (req, res) => {
  const { name, resource } = req.body;

  const job = {
    id: uuidv4(),
    name,
    resource,
    status: "PENDING",
    logs: ["Job created..."],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  jobs.push(job);

  // Emit immediately
  io.emit("jobUpdated", job);

  // Simulate lifecycle
  setTimeout(() => {
    job.status = "RUNNING";
    job.logs.push("Job is running on fake GPU...");
    job.updatedAt = new Date();
    io.emit("jobUpdated", job);
  }, 2000);

  setTimeout(() => {
    job.status = Math.random() > 0.2 ? "COMPLETED" : "FAILED";
    job.logs.push(`Job ${job.status.toLowerCase()}.`);
    job.updatedAt = new Date();
    io.emit("jobUpdated", job);
  }, 5000);

  res.json(job);
});

// List all jobs
app.get("/jobs", (req, res) => {
  res.json(jobs);
});

// Get job by ID
app.get("/jobs/:id", (req, res) => {
  const job = jobs.find((j) => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json(job);
});

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);

  // Send all existing jobs to new client
  jobs.forEach((job) => socket.emit("jobUpdated", job));

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// Start server
const PORT = 4000;
server.listen(PORT, () =>
  console.log(`🚀 Backend + WebSocket running at http://localhost:${PORT}`)
);
