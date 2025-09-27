"use client";

import { useState } from "react";
import { useJobStore } from "../store/jobs";

export default function JobForm() {
  const [name, setName] = useState("");
  const [command, setCommand] = useState("");
  const { addJob } = useJobStore();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !command) return;

    const res = await fetch("http://localhost:4000/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, command }),
    });

    if (res.ok) {
      const job = await res.json();
      addJob(job);
      setName("");
      setCommand("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-md">
      <div>
        <label className="block text-sm font-medium">Job Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-2 py-1 rounded w-full"
          placeholder="e.g. Train model"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Command</label>
        <input
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          className="border px-2 py-1 rounded w-full"
          placeholder="e.g. python train.py"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit Job
      </button>
    </form>
  );
}
