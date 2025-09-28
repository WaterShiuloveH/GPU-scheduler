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
    if (job.status !== "PENDING") return; // avoid double-run

    job.status = "RUNNING";
  
    const logLine = "Job is running on fake GPU...";
    if (job.logs[job.logs.length - 1] !== logLine) {
      job.logs.push(logLine);
    }
  
    job.updatedAt = new Date();
  
    io.emit("jobUpdated", job);
    io.emit("jobLog", { jobId: job.id, log: "Started running on GPU..." });
  }, 2000);

  setTimeout(() => {
  // Don’t update if already in a terminal state
  if (job.status === "COMPLETED" || job.status === "FAILED") return;

  const success = Math.random() > 0.2;
  job.status = success ? "COMPLETED" : "FAILED";

  const logLine = `Job ${job.status.toLowerCase()}.`;

  // Only push if it’s not already the last log
  if (job.logs[job.logs.length - 1] !== logLine) {
    job.logs.push(logLine);
  }

  job.updatedAt = new Date();

  io.emit("jobUpdated", job);
  io.emit("jobLog", { jobId: job.id, log: logLine });
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
