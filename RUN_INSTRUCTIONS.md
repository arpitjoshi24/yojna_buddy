# YojnaBuddy - Project Setup and Run Instructions

## Prerequisites

Before running this project, make sure you have:

1. **Node.js** (version 16 or higher)
2. **MongoDB** (local installation or MongoDB Atlas)
3. **Firebase Project** (for authentication)

## Initial Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory by copying from `.env.example`:

```bash
cp .env.example .env
```

Then update the `.env` file with your actual credentials:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-actual-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/planner
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/planner

# Server Configuration
PORT=5000
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable **Authentication** with Email/Password provider
4. Enable **Firestore Database**
5. Get your configuration from Project Settings > General > Your apps
6. Update the `.env` file with your Firebase credentials

### 4. MongoDB Setup

**Option A: Local MongoDB**
- Install MongoDB locally
- Start MongoDB service
- Use connection string: `mongodb://localhost:27017/planner`

**Option B: MongoDB Atlas (Cloud)**
- Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
- Create a cluster
- Get connection string and update `.env`

## Running the Project

### Method 1: Run Both Frontend and Backend Together (Recommended)

```bash
npm run dev:all
```

This command runs both the backend server and frontend development server concurrently.

### Method 2: Run Frontend and Backend Separately

**Terminal 1 - Backend Server:**
```bash
npm run backend
```
The backend will start on `http://localhost:5000`

**Terminal 2 - Frontend Development Server:**
```bash
npm run dev
```
The frontend will start on `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start frontend development server
- `npm run backend` - Start backend server
- `npm run dev:all` - Start both frontend and backend concurrently
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
├── src/                    # Frontend React application
│   ├── components/         # Reusable React components
│   ├── contexts/          # React contexts (Auth, Data)
│   ├── pages/             # Page components
│   ├── types/             # TypeScript type definitions
│   └── firebase.ts        # Firebase configuration
├── server/                # Backend Node.js/Express application
│   ├── models/            # MongoDB/Mongoose models
│   ├── routes/            # Express route handlers
│   └── index.ts           # Server entry point
└── package.json           # Dependencies and scripts
```

## Features

- **Authentication**: Firebase Auth with email/password
- **Dashboard**: Overview of projects, tasks, and deadlines
- **Project Planner**: Manage complex projects with status tracking
- **Student Planner**: Track academic assignments and deadlines
- **To-Do List**: Personal task management
- **Journal**: Daily reflections with mood tracking
- **Notifications**: Deadline alerts and reminders

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running locally or check Atlas connection string
   - Verify network access in MongoDB Atlas

2. **Firebase Authentication Error**
   - Check Firebase configuration in `.env`
   - Ensure Authentication is enabled in Firebase Console

3. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill existing processes: `lsof -ti:5000 | xargs kill -9`

4. **CORS Issues**
   - Backend includes CORS middleware
   - Ensure frontend is running on correct port

### Development Tips

- Use browser developer tools to check console for errors
- Check network tab for API request/response issues
- MongoDB data can be viewed using MongoDB Compass
- Firebase data can be viewed in Firebase Console

## Production Deployment

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Deploy backend to your preferred hosting service (Heroku, Railway, etc.)

3. Deploy frontend build to static hosting (Netlify, Vercel, etc.)

4. Update environment variables in production

## Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure all services (MongoDB, Firebase) are properly configured
4. Check that all dependencies are installed