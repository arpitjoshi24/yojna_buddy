import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { projectRouter } from './routes/projects.js';
import { taskRouter } from './routes/tasks.js';
import { journalRouter } from './routes/journals.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/projects', projectRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/journals', journalRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});