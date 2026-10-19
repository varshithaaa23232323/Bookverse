import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const typeLabel = {
  used:     { text: 'Second Hand', cls: 'bg-amber-100 text-amber-800' },
  new:      { text: 'Brand New',   cls: 'bg-emerald-100 text-emerald-800' },
  donation: { text: 'Free Donation',cls: 'bg-sky-100 text-sky-800' },
  ebook:    { text: 'Ebook',       cls: 'bg-violet-100 text-violet-800' },
};

export default function BookCard({ book }) {
  const { items, add, decrement } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();
  
  const t = typeLabel[book.type] || typeLabel.new;
  const cartItem = items.find((b) => b._id === book._id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => {
    if (!user) nav('/login');
    else add(book);
  };

  return (
    <div className="group bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition flex flex-col">
      <Link to={`/book/${book._id}`} className="aspect-[3/4] bg-neutral-100 overflow-hidden block">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          onError={(e) => (e.target.src = `https://placehold.co/300x400/eeeeee/333333?text=${encodeURIComponent(book.title)}`)}
        />
      </Link>
      
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${t.cls}`}>{t.text}</span>
            <span className="text-xs text-neutral-500 truncate ml-2">{book.author}</span>
          </div>
          
          <Link to={`/book/${book._id}`}>
            <h3 className="font-semibold text-neutral-900 leading-snug line-clamp-2 mb-3 hover:text-brand-600 transition">{book.title}</h3>
          </Link>
        </div>

        {book.type === 'ebook' ? (
          <a href={book.ebookLink} target="_blank" rel="noreferrer"
             className="block text-center w-full py-2 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition">
            Read Ebook
          </a>
        ) : (
          <div className="flex items-center justify-between mt-auto pt-2">
            <span className="font-bold text-neutral-900">
              {book.type === 'donation' || book.price === 0 ? 'Free' : `₹${book.price}`}
            </span>
            
            {user?.role === 'admin' ? (
              <span className="text-xs font-bold text-neutral-400 bg-neutral-100 px-2 py-1 rounded">Admin</span>
            ) : quantity === 0 ? (
              <button onClick={handleAdd}
                className="px-4 py-1.5 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition">
                Add
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-brand-50 border border-brand-200 rounded-lg p-1">
                <button onClick={() => decrement(book._id)} className="w-6 h-6 flex items-center justify-center text-brand-700 font-bold hover:bg-brand-200 rounded transition">-</button>
                <span className="text-sm font-bold text-brand-700 w-4 text-center">{quantity}</span>
                <button onClick={() => add(book)} className="w-6 h-6 flex items-center justify-center text-brand-700 font-bold hover:bg-brand-200 rounded transition">+</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}