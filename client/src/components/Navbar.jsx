import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const link = 'px-3 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition';

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/shop?q=${search}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="w-8 h-8 rounded-lg bg-brand-600 text-white grid place-items-center font-bold">B</span>
          <span className="font-bold text-lg tracking-tight hidden sm:block">BookVerse</span>
        </Link>

        {/* Search Bar (Only show if not admin) */}
        {user?.role !== 'admin' && (
          <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:block">
            <input 
              type="text" 
              placeholder="Search books, authors..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm bg-neutral-50"
            />
          </form>
        )}

        <nav className="flex items-center gap-1 shrink-0">
          {user?.role !== 'admin' && <NavLink to="/shop" className={link}>Shop</NavLink>}
          
          {user && user.role === 'user' && (
            <>
              <NavLink to="/submit" className={link}>Submit</NavLink>
              <NavLink to="/my-orders" className={link}>Orders</NavLink>
            </>
          )}

          {user && user.role === 'admin' && <NavLink to="/admin" className={link}>Admin Dashboard</NavLink>}
          
          {user?.role !== 'admin' && (
            <Link to="/cart" className="relative px-3 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-100">
              🛒 Cart
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-xs w-5 h-5 rounded-full grid place-items-center">
                  {cartCount}
                </span>
              )}
            </Link>
          )}
          
          {user ? (
            <button onClick={logout} className="ml-2 px-3 py-2 text-sm font-medium rounded-lg border border-neutral-300 hover:bg-neutral-100">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className={link}>Login</Link>
              <Link to="/register" className="ml-1 px-4 py-2 text-sm font-semibold rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}