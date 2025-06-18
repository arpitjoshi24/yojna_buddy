import express from 'express';
import { Journal } from '../models/Journal';

const router = express.Router();

// Get all journals for a user
router.get('/:userId', async (req, res) => {
  try {
    const journals = await Journal.find({ userId: req.params.userId });
    res.json(journals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching journals', error });
  }
});

// Create a new journal
router.post('/', async (req, res) => {
  try {
    const journal = new Journal(req.body);
    await journal.save();
    res.status(201).json(journal);
  } catch (error) {
    res.status(400).json({ message: 'Error creating journal', error });
  }
});

// Update a journal
router.put('/:id', async (req, res) => {
  try {
    const journal = await Journal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(journal);
  } catch (error) {
    res.status(400).json({ message: 'Error updating journal', error });
  }
});

// Delete a journal
router.delete('/:id', async (req, res) => {
  try {
    await Journal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Journal deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting journal', error });
  }
});

export const journalRouter = router;