import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(cors());
app.use(express.json());

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

  // Simulate lifecycle
  setTimeout(() => {
    job.status = "RUNNING";
    job.logs.push("Job is running on fake GPU...");
    job.updatedAt = new Date();
  }, 2000);

  setTimeout(() => {
    job.status = Math.random() > 0.2 ? "COMPLETED" : "FAILED";
    job.logs.push(`Job ${job.status.toLowerCase()}.`);
    job.updatedAt = new Date();
  }, 5000);

  res.json(job);
});

// List all jobs
app.get("/jobs", (req, res) => {
  res.json(jobs);
});

// Get job by ID
app.get("/jobs/:id", (req, res) => {
  const job = jobs.find(j => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json(job);
});

// Start server
const PORT = 4000;
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
