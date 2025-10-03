🎯 Quiz Builder

A full-stack web application for creating and managing custom quizzes with different question types.

🚀 Features

Create Quizzes with multiple question types (Boolean, Input, Checkbox)

View All Quizzes in a clean dashboard

Detailed Quiz View with read-only question display

Delete Quizzes with confirmation

Responsive Design that works on desktop and mobile

🛠️ Tech Stack

Frontend

Next.js 15 with App Router

React 19 with TypeScript

Tailwind CSS for styling

Axios for API calls

Backend

Node.js with Express

TypeScript for type safety

SQLite with Prisma ORM

CORS enabled for frontend communication

📋 Prerequisites

Node.js 24 installed

npm or yarn package manager

🏃‍♂️ Quick Start
1. Clone and Setup
   bash
# Clone the repository
git clone <your-repo-url>
cd Quiz-Builder

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
2. Database Setup
   bash
# Navigate to backend directory
cd backend

# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma db push
3. Environment Configuration Backend (backend/.env):

env

DATABASE_URL="file:./dev.db"

PORT=5000

Frontend (frontend/.env.local):

env

NEXT_PUBLIC_API_URL=http://localhost:5000

4. Start the Application

Terminal 1 - Backend Server

bash
cd backend

npm run dev

✅ Backend running on: http://localhost:5000

Terminal 2 - Frontend Server

bash
cd frontend

npm run dev

✅ Frontend running on: http://localhost:3000


### 📝 Creating Your First Quiz

Method 1: Using the Web Interface
Open http://localhost:3000

Click "Create New Quiz"

Add a quiz title (e.g., "Science Quiz")

Add questions using the buttons:

Add Boolean: True/False questions

Add Input: Text input questions

Add Checkbox: Multiple choice with several correct answers

Click "Create Quiz"