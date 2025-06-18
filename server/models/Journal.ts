import mongoose from 'mongoose';

const journalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, required: true },
  mood: {
    type: String,
    enum: ['great', 'good', 'neutral', 'bad', 'terrible']
  },
  tags: [{ type: String }],
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Journal = mongoose.model('Journal', journalSchema);