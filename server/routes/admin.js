const router = require('express').Router();
const Book = require('../models/Book');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

// GET /api/admin/books — all books, any status
router.get('/books', async (_req, res) => {
  try {
    const books = await Book.find()
      .populate('submittedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/pending — pending submissions
router.get('/pending', async (_req, res) => {
  try {
    const books = await Book.find({ status: 'pending' })
      .populate('submittedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/admin/books — admin adds an approved book directly
router.post('/books', async (req, res) => {
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
      status: 'approved',
      owner: req.user._id,
    });

    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/books/:id — edit any book
router.put('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const fields = ['title', 'author', 'description', 'coverImage', 'price', 'type', 'ebookLink', 'status'];
    fields.forEach((k) => {
      if (req.body[k] !== undefined) book[k] = req.body[k];
    });
    await book.save();
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/admin/books/:id/approve
router.patch('/books/:id/approve', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    book.status = 'approved';
    book.owner = req.user._id;
    await book.save();
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/admin/books/:id/reject
router.patch('/books/:id/reject', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    book.status = 'rejected';
    await book.save();
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/books/:id
router.delete('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/users — get all users for stats
router.get('/users', async (_req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;