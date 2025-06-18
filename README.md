# PlanIt - Personal Planner App

PlanIt is a comprehensive personal planning application designed to help users organize their projects, academic work, daily tasks, and journal entries.

## Features

- **Authentication** - Secure login/signup to access your personalized data
- **Dashboard** - Get an overview of upcoming deadlines and important tasks
- **Project Planner** - Manage complex projects with status tracking and priority levels
- **Student Planner** - Keep track of academic assignments and study schedules
- **To-Do List** - Organize daily tasks with priority levels and due dates
- **Journal** - Record daily reflections with mood tracking and tagging
- **Notifications** - Get alerts about approaching and overdue deadlines

## Technology Stack

- React with TypeScript for the frontend
- Firebase Authentication for user management
- Firestore for data persistence
- TailwindCSS for styling
- Lucide React for icons

## Setup Instructions

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a Firebase project and enable Authentication and Firestore
4. Create a `.env` file based on `.env.example` and add your Firebase credentials
5. Run the development server with `npm run dev`

## Firebase Configuration

You need to set up a Firebase project with Authentication (email/password) and Firestore. Add your Firebase configuration in the `.env` file:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## Usage

1. Sign up for a new account
2. Navigate through the different sections using the sidebar or bottom navigation
3. Add projects, tasks, assignments, and journal entries
4. Track your progress and stay organized!