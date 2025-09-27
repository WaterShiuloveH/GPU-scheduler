# GPU Job Scheduler Mock – Backend

This is a **mock backend** for a mini GPU job scheduler. It provides APIs for submitting jobs, monitoring status, and retrieving logs. Designed for demo purposes to showcase end-to-end system understanding.

---

## **Getting Started**

### Requirements
- Node.js >= 20
- npm

### Installation
```bash
git clone <repo-url>
cd backend
npm install
```

### Run the Server
```bash
npm run dev
```

### The server will run at:
```bash
http://localhost:4000
```

## API Endpoints

### Create a Job
```js
POST /jobs
```
#### Request Body:
```json
{
  "name": "example-job",
  "resource": "GPU-1"
}
```
#### Response:
```json
{
  "id": "uuid",
  "name": "example-job",
  "resource": "GPU-1",
  "status": "pending",
  "logs": []
}
```
### Get All Jobs
```js
GET /jobs
```
#### Response:
```json
[
  {
    "id": "uuid1",
    "name": "example-job",
    "resource": "GPU-1",
    "status": "running",
    "logs": ["Job started at 12:01"]
  }
]
```

### Get Job Details
```js
GET /jobs/:id
```
#### Response:
```json
{
  "id": "uuid1",
  "name": "example-job",
  "resource": "GPU-1",
  "status": "running",
  "logs": [
    "Job created at 12:00",
    "Job started at 12:01"
  ]
}
```

## Job Status
```bash
pending – Job submitted but not yet running

running – Job currently executing

completed – Job finished successfully

failed – Job encountered an error
```
