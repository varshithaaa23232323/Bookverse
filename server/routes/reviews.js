const router = require('express').Router();
const Review = require('../models/Review');
const { protect } = require('../middleware/auth');

// GET /api/reviews/:bookId - Get all reviews for a book
router.get('/:bookId', async (req, res) => {
  try {
    const reviews = await Review.find({ book: req.params.bookId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/reviews/:bookId - Add a review
router.post('/:bookId', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    // Check if user already reviewed
    const existing = await Review.findOne({ book: req.params.bookId, user: req.user._id });
    if (existing) return res.status(400).json({ message: 'You have already reviewed this book.' });

    const review = await Review.create({
      book: req.params.bookId,
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;