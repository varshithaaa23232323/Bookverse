import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios'; // <-- Import API

export default function Cart() {
  const { items, remove, updateQuantity, total, clear } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();

  const [details, setDetails] = useState({ name: '', phone: '', address: '', pincode: '' });
  const [err, setErr] = useState('');

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!user) return nav('/login');
    
    if (!details.name.trim()) return setErr('Please enter your full name.');
    if (!/^\d{10}$/.test(details.phone)) return setErr('Phone number must be exactly 10 digits.');
    if (!details.address.trim() || details.address.length < 10) return setErr('Please enter a complete address.');
    if (!/^\d{6}$/.test(details.pincode)) return setErr('Pincode must be exactly 6 digits.');

    try {
      await api.post('/orders', {
        items: items.map(i => ({ book: i._id, title: i.title, price: i.price, quantity: i.quantity })),
        totalAmount: total,
        deliveryDetails: details
      });
      clear(); 
      nav('/success');
    } catch (err) {
      setErr('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-6">Checkout</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-20 text-neutral-500 bg-white border border-neutral-200 rounded-2xl">
          <p className="text-5xl mb-3">🛒</p>
          <p>Your cart is empty.</p>
          <button onClick={() => nav('/shop')} className="mt-4 px-6 py-2 rounded-lg bg-brand-600 text-white font-semibold hover:bg-brand-700">
            Browse Books
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8 items-start">
          
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-2">Items in Cart ({items.length})</h2>
            {items.map((b) => (
              <div key={b._id} className="flex items-center gap-4 bg-white border border-neutral-200 rounded-2xl p-4">
                <img src={b.coverImage} className="w-16 h-20 object-cover rounded-lg bg-neutral-100" alt="" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{b.title}</h3>
                  <p className="text-xs text-neutral-500 mb-2">{b.author}</p>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-neutral-300 rounded-lg">
                      <button onClick={() => updateQuantity(b._id, -1)} className="px-2 py-1 hover:bg-neutral-100 rounded-l-lg">-</button>
                      <span className="px-3 text-sm font-medium">{b.quantity}</span>
                      <button onClick={() => updateQuantity(b._id, 1)} className="px-2 py-1 hover:bg-neutral-100 rounded-r-lg">+</button>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold block">₹{(b.price * b.quantity)}</span>
                  <button onClick={() => remove(b._id)} className="text-neutral-400 hover:text-red-600 transition mt-2" title="Remove item">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold mb-4">Delivery Details</h2>
            
            <form onSubmit={placeOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
                <input required type="text" placeholder="e.g. Varshitha" value={details.name} 
                  onChange={(e) => setDetails({ ...details, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Phone Number</label>
                <input required type="tel" placeholder="10-digit mobile number" value={details.phone} 
                  onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Full Address</label>
                <textarea required placeholder="House no, Street, Area, City" rows={3} value={details.address} 
                  onChange={(e) => setDetails({ ...details, address: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Pincode</label>
                <input required type="text" placeholder="6-digit pincode" value={details.pincode} 
                  onChange={(e) => setDetails({ ...details, pincode: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>

              <div className="border-t border-neutral-200 pt-4 mt-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total to Pay</span>
                  <span>₹{total}</span>
                </div>
                <p className="text-sm text-neutral-600 mt-1 mb-4">
                  Payment method: <b>Cash on Delivery</b>
                </p>
              </div>

              {err && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">{err}</p>}

              <button className="w-full py-3 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 transition">
                Place Order (COD)
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}