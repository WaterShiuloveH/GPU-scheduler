"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { api } from "../lib/api";
import { useJobStore } from "../store/jobs";
import JobForm from "../components/JobForm";

export default function Home() {
  const { jobs, setJobs, updateJob } = useJobStore();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initial fetch (in case socket connects late)
  async function fetchJobs() {
    try {
      setError(null);
      const res = await api.get("/jobs");
      setJobs(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchJobs();

    // Connect to backend socket
    const socket = io("http://localhost:4000");

    socket.on("connect", () => {
      console.log("✅ Connected to WebSocket:", socket.id);
    });

    socket.on("jobUpdated", (job) => {
      console.log("📡 Job update received:", job);
      updateJob(job.id, job); // merge into Zustand
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from WebSocket");
    });

    return () => {
      socket.disconnect();
    };
  }, [setJobs, updateJob]);

  return (
    <main className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">GPU Job Scheduler</h1>
      <JobForm />

      <section>
        <h2 className="text-xl font-semibold mb-2">Jobs</h2>

        {loading && <p className="text-gray-500">Loading jobs...</p>}

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
        )}

        {!loading && !error && (
          <ul className="space-y-2">
            {jobs.map((job) => (
              <li key={job.id} className="p-3 border rounded-md">
                <strong>{job.name}</strong> — {job.status}
              </li>
            ))}
            {jobs.length === 0 && (
              <p className="text-gray-500">No jobs found.</p>
            )}
          </ul>
        )}
      </section>
    </main>
  );
}
