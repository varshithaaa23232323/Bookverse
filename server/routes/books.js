const router = require('express').Router();
const Book = require('../models/Book');
const { protect } = require('../middleware/auth');

// GET /api/books?type=used|new|donation|ebook  (public, approved only)
router.get('/', async (req, res) => {
  try {
    const filter = { status: 'approved' };
    if (req.query.type) filter.type = req.query.type;
    const books = await Book.find(filter).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/books/my/submissions  (protected) — user's own submissions
router.get('/my/submissions', protect, async (req, res) => {
  try {
    const books = await Book.find({ submittedBy: req.user._id }).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/books/submit  (protected) — user submits a book for approval
router.post('/submit', protect, async (req, res) => {
  try {
    const { title, author, description, coverImage, price, type, ebookLink } = req.body;

    if (!title || !author || !type) {
      return res.status(400).json({ message: 'Title, author and type are required' });
    }
    if (!['used', 'new', 'donation', 'ebook'].includes(type)) {
      return res.status(400).json({ message: 'Invalid type' });
    }
    if (type === 'ebook' && !ebookLink) {
      return res.status(400).json({ message: 'Ebook link is required for ebooks' });
    }

    const book = await Book.create({
      title,
      author,
      description: description || '',
      coverImage: coverImage || undefined,
      price: type === 'donation' || type === 'ebook' ? 0 : Number(price) || 0,
      type,
      ebookLink: ebookLink || '',
      status: 'pending',
      submittedBy: req.user._id,
    });

    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/books/:id  (public, approved only)
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, status: 'approved' });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch {
    res.status(400).json({ message: 'Invalid book id' });
  }
});

module.exports = router;