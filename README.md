# Student Grade Submission Panel - MERN Stack

A minimal MERN stack application for submitting and viewing student grades.

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB installed and running

### Installation

1. Install backend dependencies:
```bash
npm install
```

2. Install frontend dependencies:
```bash
cd client
npm install
```

### Running the Application

1. Start MongoDB service
2. Start the backend server:
```bash
npm run dev
```

3. In a new terminal, start the React frontend:
```bash
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Features

- Submit student grades with name, subject, and score
- View all submitted grades in chronological order
- Responsive design
- Real-time updates

## API Endpoints

- `GET /api/grades` - Fetch all grades
- `POST /api/grades` - Submit a new grade