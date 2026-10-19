const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    coverImage: {
      type: String,
      default: 'https://via.placeholder.com/300x400?text=BookVerse',
    },
    price: { type: Number, default: 0, min: 0 },
    type: {
      type: String,
      enum: ['used', 'new', 'donation', 'ebook'],
      required: true,
    },
    ebookLink: { type: String, default: '' },
    status: {
      type: String,
      enum: ['approved', 'pending', 'rejected'],
      default: 'approved',
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', BookSchema);