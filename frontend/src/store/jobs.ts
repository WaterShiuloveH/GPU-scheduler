import { create } from "zustand";

type Job = {
  id: string;
  name: string;
  command: string;
  status: string;
  logs: string[];
  createdAt: string | Date;
  updatedAt: string | Date;
};

type JobStore = {
  jobs: Job[];
  setJobs: (jobs: Job[]) => void;
  addJob: (job: Job) => void;
  updateJob: (id: string, job: Partial<Job>) => void;
  addLog: (id: string, log: string) => void;
};

export const useJobStore = create<JobStore>((set) => ({
  jobs: [],
  setJobs: (jobs) => set({ jobs }),
  addJob: (job) => set((state) => ({ jobs: [...state.jobs, job] })),
  updateJob: (id, job) =>
    set((state) => ({
      jobs: state.jobs.map((j) => (j.id === id ? { ...j, ...job } : j)),
    })),
  addLog: (id, log) =>
    set((state) => ({
      jobs: state.jobs.map((j) =>
        j.id === id ? { ...j, logs: [...j.logs, log] } : j
      ),
    })),
}));
