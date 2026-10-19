require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('./models/Book');

// Helper to generate accurate book covers dynamically
const createBook = (title, author, type, price, extra = {}) => {
  // This API automatically finds the cover based on the title and author
  const coverImage = `https://covers.openlibrary.org/b/isbn/${encodeURIComponent(title)}-L.jpg?default=false`;
  
  // Fallback to a nice placeholder if OpenLibrary doesn't have it
  const fallbackImage = `https://placehold.co/300x400/eeeeee/333333?text=${encodeURIComponent(title)}`;
  
  return {
    title,
    author,
    description: `A fantastic ${type} book by ${author}. Perfect for your collection.`,
    coverImage: fallbackImage, // We use placeholder for now, we will fix the real image link below
    price,
    type,
    status: 'approved',
    ...extra
  };
};

// Actually, let's use Open Library's search API format for covers. 
// It's much more accurate for titles.
const getCover = (title, author) => {
  // Clean the title to make a good search query
  const cleanTitle = encodeURIComponent(title.trim());
  const cleanAuthor = encodeURIComponent(author.trim());
  // Using the default OpenLibrary cover API which redirects to the actual cover
  return `https://covers.openlibrary.org/b/title/${cleanTitle}-L.jpg`;
};

const createBookWithCover = (title, author, type, price, extra = {}) => ({
  title,
  author,
  description: `A fantastic ${type} book by ${author}. Perfect for your collection.`,
  coverImage: `https://covers.openlibrary.org/b/title/${encodeURIComponent(title)}-L.jpg`,
  price,
  type,
  status: 'approved',
  ...extra
});

const books = [
  // ---------------- 25 NEW BOOKS ----------------
  createBookWithCover('The Alchemist', 'Paulo Coelho', 'new', 299),
  createBookWithCover('Atomic Habits', 'James Clear', 'new', 450),
  createBookWithCover('The Psychology of Money', 'Morgan Housel', 'new', 350),
  createBookWithCover('Ikigai', 'Hector Garcia', 'new', 399),
  createBookWithCover('The Midnight Library', 'Matt Haig', 'new', 420),
  createBookWithCover('Project Hail Mary', 'Andy Weir', 'new', 550),
  createBookWithCover('Klara and the Sun', 'Kazuo Ishiguro', 'new', 380),
  createBookWithCover('The Four Winds', 'Kristin Hannah', 'new', 399),
  createBookWithCover('Dune', 'Frank Herbert', 'new', 499),
  createBookWithCover('1984', 'George Orwell', 'new', 250),
  createBookWithCover('Animal Farm', 'George Orwell', 'new', 199),
  createBookWithCover('The Song of Achilles', 'Madeline Miller', 'new', 350),
  createBookWithCover('Circe', 'Madeline Miller', 'new', 380),
  createBookWithCover('Educated', 'Tara Westover', 'new', 420),
  createBookWithCover('Becoming', 'Michelle Obama', 'new', 600),
  createBookWithCover('A Brief History of Time', 'Stephen Hawking', 'new', 450),
  createBookWithCover('Cosmos', 'Carl Sagan', 'new', 500),
  createBookWithCover('The Martian', 'Andy Weir', 'new', 380),
  createBookWithCover('Ready Player One', 'Ernest Cline', 'new', 350),
  createBookWithCover('The Silent Patient', 'Alex Michaelides', 'new', 399),
  createBookWithCover('Where the Crawdads Sing', 'Delia Owens', 'new', 450),
  createBookWithCover('The Vanishing Half', 'Brit Bennett', 'new', 420),
  createBookWithCover('Normal People', 'Sally Rooney', 'new', 350),
  createBookWithCover('The Seven Husbands of Evelyn Hugo', 'Taylor Jenkins Reid', 'new', 380),
  createBookWithCover('Six of Crows', 'Leigh Bardugo', 'new', 450),

  // ---------------- 25 USED BOOKS ----------------
  createBookWithCover('Sapiens', 'Yuval Noah Harari', 'used', 250),
  createBookWithCover('The Great Gatsby', 'F. Scott Fitzgerald', 'used', 150),
  createBookWithCover('Thinking, Fast and Slow', 'Daniel Kahneman', 'used', 300),
  createBookWithCover('The Catcher in the Rye', 'J.D. Salinger', 'used', 180),
  createBookWithCover('Lord of the Flies', 'William Golding', 'used', 160),
  createBookWithCover('Fahrenheit 451', 'Ray Bradbury', 'used', 200),
  createBookWithCover('Brave New World', 'Aldous Huxley', 'used', 220),
  createBookWithCover('The Picture of Dorian Gray', 'Oscar Wilde', 'used', 190),
  createBookWithCover('Frankenstein', 'Mary Shelley', 'used', 170),
  createBookWithCover('Dracula', 'Bram Stoker', 'used', 210),
  createBookWithCover('Moby Dick', 'Herman Melville', 'used', 280),
  createBookWithCover('War and Peace', 'Leo Tolstoy', 'used', 350),
  createBookWithCover('Crime and Punishment', 'Fyodor Dostoevsky', 'used', 300),
  createBookWithCover('The Brothers Karamazov', 'Fyodor Dostoevsky', 'used', 320),
  createBookWithCover('Anna Karenina', 'Leo Tolstoy', 'used', 280),
  createBookWithCover('Les Misérables', 'Victor Hugo', 'used', 400),
  createBookWithCover('The Count of Monte Cristo', 'Alexandre Dumas', 'used', 380),
  createBookWithCover('Don Quixote', 'Miguel de Cervantes', 'used', 350),
  createBookWithCover('The Odyssey', 'Homer', 'used', 200),
  createBookWithCover('The Iliad', 'Homer', 'used', 200),
  createBookWithCover('A Tale of Two Cities', 'Charles Dickens', 'used', 220),
  createBookWithCover('Great Expectations', 'Charles Dickens', 'used', 240),
  createBookWithCover('Wuthering Heights', 'Emily Brontë', 'used', 180),
  createBookWithCover('Jane Eyre', 'Charlotte Brontë', 'used', 190),
  createBookWithCover('Little Women', 'Louisa May Alcott', 'used', 210),

  // ---------------- 25 DONATION BOOKS ----------------
  createBookWithCover('The Hobbit', 'J.R.R. Tolkien', 'donation', 0),
  createBookWithCover('Pride and Prejudice', 'Jane Austen', 'donation', 0),
  createBookWithCover('To Kill a Mockingbird', 'Harper Lee', 'donation', 0),
  createBookWithCover('The Book Thief', 'Markus Zusak', 'donation', 0),
  createBookWithCover('The Kite Runner', 'Khaled Hosseini', 'donation', 0),
  createBookWithCover('A Thousand Splendid Suns', 'Khaled Hosseini', 'donation', 0),
  createBookWithCover('Life of Pi', 'Yann Martel', 'donation', 0),
  createBookWithCover('The Grapes of Wrath', 'John Steinbeck', 'donation', 0),
  createBookWithCover('Of Mice and Men', 'John Steinbeck', 'donation', 0),
  createBookWithCover('East of Eden', 'John Steinbeck', 'donation', 0),
  createBookWithCover('Catch-22', 'Joseph Heller', 'donation', 0),
  createBookWithCover('Slaughterhouse-Five', 'Kurt Vonnegut', 'donation', 0),
  createBookWithCover('The Bell Jar', 'Sylvia Plath', 'donation', 0),
  createBookWithCover('On the Road', 'Jack Kerouac', 'donation', 0),
  createBookWithCover('The Sun Also Rises', 'Ernest Hemingway', 'donation', 0),
  createBookWithCover('A Farewell to Arms', 'Ernest Hemingway', 'donation', 0),
  createBookWithCover('For Whom the Bell Tolls', 'Ernest Hemingway', 'donation', 0),
  createBookWithCover('The Old Man and the Sea', 'Ernest Hemingway', 'donation', 0),
  createBookWithCover('Beloved', 'Toni Morrison', 'donation', 0),
  createBookWithCover('The Color Purple', 'Alice Walker', 'donation', 0),
  createBookWithCover('Invisible Man', 'Ralph Ellison', 'donation', 0),
  createBookWithCover('Native Son', 'Richard Wright', 'donation', 0),
  createBookWithCover('Things Fall Apart', 'Chinua Achebe', 'donation', 0),
  createBookWithCover('Midnight\'s Children', 'Salman Rushdie', 'donation', 0),
  createBookWithCover('The God of Small Things', 'Arundhati Roy', 'donation', 0),

  // ---------------- 25 EBOOKS ----------------
  createBookWithCover('Rich Dad Poor Dad', 'Robert T. Kiyosaki', 'ebook', 0, { ebookLink: 'https://openlibrary.org/works/OL15073082W' }),
  createBookWithCover('The Art of War', 'Sun Tzu', 'ebook', 0, { ebookLink: 'https://www.gutenberg.org/files/132/132-h/132-h.htm' }),
  createBookWithCover('Meditations', 'Marcus Aurelius', 'ebook', 0, { ebookLink: 'https://www.gutenberg.org/files/2680/2680-h/2680-h.htm' }),
  createBookWithCover('The Republic', 'Plato', 'ebook', 0, { ebookLink: 'https://www.gutenberg.org/files/1497/1497-h/1497-h.htm' }),
  createBookWithCover('Thus Spoke Zarathustra', 'Friedrich Nietzsche', 'ebook', 0, { ebookLink: 'https://www.gutenberg.org/files/1998/1998-h/1998-h.htm' }),
  createBookWithCover('Beyond Good and Evil', 'Friedrich Nietzsche', 'ebook', 0, { ebookLink: 'https://www.gutenberg.org/files/4363/4363-h/4363-h.htm' }),
  createBookWithCover('The Prince', 'Niccolò Machiavelli', 'ebook', 0, { ebookLink: 'https://www.gutenberg.org/files/1232/1232-h/1232-h.htm' }),
  createBookWithCover('The Wealth of Nations', 'Adam Smith', 'ebook', 0, { ebookLink: 'https://www.gutenberg.org/files/3300/3300-h/3300-h.htm' }),
  createBookWithCover('Das Kapital', 'Karl Marx', 'ebook', 0, { ebookLink: 'https://www.gutenberg.org/files/46423/46423-h/46423-h.htm' }),
  createBookWithCover('The Communist Manifesto', 'Karl Marx', 'ebook', 0, { ebookLink: 'https://www.gutenberg.org/files/61/61-h/61-h.htm' }),
  createBookWithCover('Common Sense', 'Thomas Paine', 'ebook', 0, { ebookLink: 'https://www.gutenberg.org/files/147/147-h/147-h.htm' }),
  createBookWithCover('The Federalist Papers', 'Alexander Hamilton', 'ebook', 0, { ebookLink: 'https://www.gutenberg.org/files/1404/1404-h/1404-h.htm' }),
  createBookWithCover('The Declaration of Independence', 'Thomas Jefferson', 'ebook', 0, { ebookLink: 'https://www.gutenberg.org/files/1/1-h/1-h.htm' }),
  createBookWithCover('The US Constitution', 'James Madison', 'ebook', 0, { ebookLink: 'https://www.gutenberg.org/files/5/5-h/5-h.htm' }),
  createBookWithCover('The Odyssey', 'Homer', 'ebook', 0, { ebookLink: 'https://www.gutenberg.org/files/1727/1727-h/1727-h.htm' }),
  createBookWithCover('The Iliad', 'Homer', 'ebook', 0, { ebookLink: 'https://www.gutenberg.org/files/6130/6130-h/6130-h.htm' }),
  createBookWithCover('The Aeneid', 'Virgil', 'ebook', 0, { ebookLink: 'https://www.gutenberg.org/files/228/228-h/228-h.htm' }),
  createBookWithCover('Metamorphoses', 'Ovid', 'ebook', 0, { ebookLink: 'https://www.gutenberg.org/files/21765/21765-h/21765-h.htm' }),
  createBookWithCover('The Divine Comedy', 'Dante Alighieri', 'ebook', 0, { ebookLink: 'https://www.gutenberg.org/files/8800/8800-h/8800-h.htm' }),
  createBookWithCover('Paradise Lost', 'John Milton', 'ebook', 0, { ebookLink: 'https://www.gutenberg.org/files/26/26-h/26-h.htm' }),
  createBookWithCover('The Canterbury Tales', 'Geoffrey Chaucer', 'ebook', 0, { ebookLink: 'https://www.gutenberg.org/files/2383/2383-h/2383-h.htm' }),
  createBookWithCover('Beowulf', 'Unknown', 'ebook', 0, { ebookLink: 'https://www.gutenberg.org/files/16328/16328-h/16328-h.htm' }),
  createBookWithCover('The Epic of Gilgamesh', 'Unknown', 'ebook', 0, { ebookLink: 'https://www.gutenberg.org/files/11000/11000-h/11000-h.htm' }),
  createBookWithCover('The Mahabharata', 'Vyasa', 'ebook', 0, { ebookLink: 'https://www.gutenberg.org/files/15474/15474-h/15474-h.htm' }),
  createBookWithCover('The Ramayana', 'Valmiki', 'ebook', 0, { ebookLink: 'https://www.gutenberg.org/files/24869/24869-h/24869-h.htm' }),
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    await Book.deleteMany({});
    console.log('🧹 Cleared old books');

    await Book.insertMany(books);
    console.log(`✅ Successfully added ${books.length} books with real covers!`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

seedDB();