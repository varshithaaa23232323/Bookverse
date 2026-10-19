import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function BookDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const { items, add, decrement } = useCart();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/books/${id}`)
      .then((res) => setBook(res.data))
      .catch(() => nav('/shop'))
      .finally(() => setLoading(false));
  }, [id, nav]);

  if (loading) return <div className="text-center py-20 text-neutral-500">Loading...</div>;
  if (!book) return null;

  const cartItem = items.find((b) => b._id === book._id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => {
    if (!user) nav('/login');
    else add(book);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <button onClick={() => nav('/shop')} className="text-sm font-semibold text-brand-600 hover:underline mb-6">
        ← Back to Shop
      </button>

      <div className="grid md:grid-cols-2 gap-10 bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm">
        <div className="aspect-[3/4] bg-neutral-100 rounded-2xl overflow-hidden shadow-inner">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover"
            onError={(e) => (e.target.src = `https://placehold.co/400x600/eeeeee/333333?text=${encodeURIComponent(book.title)}`)}
          />
        </div>

        <div className="flex flex-col justify-center">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-2">
            {book.type === 'used' ? 'Second Hand' : book.type === 'new' ? 'Brand New' : book.type === 'donation' ? 'Donation' : 'Ebook'}
          </span>
          <h1 className="text-4xl font-extrabold mb-2 leading-tight">{book.title}</h1>
          <p className="text-lg text-neutral-500 mb-6">by {book.author}</p>

          <div className="text-3xl font-bold text-ink mb-6">
            {book.type === 'donation' || book.price === 0 ? 'Free' : `₹${book.price}`}
          </div>

          <p className="text-neutral-700 leading-relaxed mb-8">
            {book.description || 'No description provided for this book.'}
          </p>

          {book.type === 'ebook' ? (
            <a href={book.ebookLink} target="_blank" rel="noreferrer"
               className="block text-center w-full py-4 rounded-xl bg-brand-600 text-white font-bold text-lg hover:bg-brand-700 transition">
              Read Ebook Now
            </a>
          ) : user?.role === 'admin' ? (
            <div className="bg-neutral-100 text-neutral-500 text-center py-4 rounded-xl font-bold">
              Admin View (Cannot purchase)
            </div>
          ) : quantity === 0 ? (
            <button onClick={handleAdd}
              className="w-full py-4 rounded-xl bg-brand-600 text-white font-bold text-lg hover:bg-brand-700 transition">
              Add to Cart
            </button>
          ) : (
            <div className="flex items-center justify-between bg-brand-50 border border-brand-200 rounded-xl p-2">
              <button onClick={() => decrement(book._id)} className="w-12 h-12 flex items-center justify-center text-brand-700 font-bold text-xl hover:bg-brand-200 rounded-lg transition">-</button>
              <span className="text-xl font-bold text-brand-700">{quantity} in cart</span>
              <button onClick={() => add(book)} className="w-12 h-12 flex items-center justify-center text-brand-700 font-bold text-xl hover:bg-brand-200 rounded-lg transition">+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}