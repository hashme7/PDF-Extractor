# PDF-Extractor

# A modern web application for extracting and manipulating content from PDF files. Built with React, TypeScript, Node.js, and Express.

Features

* Upload PDF files and extract text content
* View and navigate through PDF documents
* Extract specific pages or page ranges
* Download extracted content in various formats
* Responsive design with Tailwind CSS
* User-friendly interface with real-time feedback

Tech Stack
Frontend

React 19
TypeScript
Tailwind CSS 4
PDF.js for PDF rendering
Axios for API communication
SweetAlert2 for notifications

Backend

Node.js
Express 5
PDF-lib for PDF manipulation
Multer for file uploads
CORS for cross-origin requests
dotenv for environment variable management

Prerequisites

Node.js (v16.x or higher)
npm or yarn
Git

Getting Started
Clone the Repository
bashgit clone https://github.com/yourusername/pdf-extractor.git
cd pdf-extractor
Backend Setup
bash# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create a .env file and add necessary environment variables
cp .env.example .env
# Edit .env with your configurations

# Start the development server
npm run dev
The backend server will run on http://localhost:3000 by default.
Frontend Setup
bash# Navigate to the frontend directory
cd ../frontend

# Install dependencies
npm install

# Start the development server
npm run dev
The frontend development server will run on http://localhost:5173 by default.
Environment Variables
Backend (.env)
PORT=3000
NODE_ENV=development
UPLOAD_LIMIT=10mb
CORS_ORIGIN=http://localhost:5173
Frontend (.env)
VITE_API_URL=http://localhost:3000/api