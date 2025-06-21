import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  completed: { type: Boolean, default: false },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  category: {
    type: String,
    enum: ['project', 'school', 'personal', 'other'],
    required: true
  },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Task = mongoose.model('Task', taskSchema);