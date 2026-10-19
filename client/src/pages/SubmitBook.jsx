import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

// Changed default type to 'used'
const empty = { title: '', author: '', description: '', coverImage: '', price: 0, type: 'used', ebookLink: '' };

export default function SubmitBook() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState(empty);
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState(false);

  if (user?.role === 'admin') {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="text-5xl mb-4">🛑</div>
        <h2 className="text-3xl font-extrabold mb-2">Admins cannot submit books.</h2>
        <p className="text-neutral-600 mb-8">Please use the Admin Panel to add books directly to the store.</p>
        <button onClick={() => nav('/admin')} className="px-6 py-3 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700">
          Go to Admin Panel
        </button>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setErr('');

    // VALIDATION CHECKS
    if (form.title.trim().length < 3) return setErr('Title must be at least 3 characters.');
    if (form.author.trim().length < 3) return setErr('Author name must be at least 3 characters.');
    if (form.description.trim().length < 10) return setErr('Please write a description of at least 10 characters.');
    // Changed validation to only check price for 'used' books
    if (form.type === 'used' && Number(form.price) <= 0) {
      return setErr('Price must be greater than 0 for used books.');
    }
    if (form.type === 'ebook' && !form.ebookLink.startsWith('http')) {
      return setErr('Please provide a valid URL starting with http:// or https://');
    }

    try {
      await api.post('/books/submit', { ...form, price: Number(form.price) });
      setSuccess(true);
      setTimeout(() => nav('/shop'), 2000);
    } catch (e) { 
      setErr(e.response?.data?.message || 'Failed to submit'); 
    }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-extrabold mb-2">Submit a Book</h2>
      <p className="text-neutral-600 mb-6">Want to sell a used book or donate one? Submit it here and the admin will review it.</p>
      
      {success ? (
        <div className="bg-emerald-50 text-emerald-800 p-6 rounded-xl border border-emerald-200 text-center">
          <p className="text-xl font-bold mb-1">Submitted successfully!</p>
          <p>Redirecting to shop...</p>
        </div>
      ) : (
        <form onSubmit={submit} className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4 shadow-sm">
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Book Title</label>
            <input required type="text" placeholder="e.g. The Alchemist" value={form.title} onChange={set('title')}
              className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Author Name</label>
            <input required type="text" placeholder="e.g. Paulo Coelho" value={form.author} onChange={set('author')}
              className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Cover Image URL (Optional)</label>
            <input type="url" placeholder="https://..." value={form.coverImage} onChange={set('coverImage')}
              className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
            <textarea required placeholder="Tell us about the book's condition..." rows={3} value={form.description} onChange={set('description')}
              className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-neutral-700 mb-1">Price (₹)</label>
              <input type="number" min="0" placeholder="0" value={form.price} onChange={set('price')}
                disabled={form.type === 'donation' || form.type === 'ebook'}
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-neutral-100 disabled:text-neutral-400" />
            </div>
            
            <div className="w-1/2">
              <label className="block text-sm font-medium text-neutral-700 mb-1">Category</label>
              <select value={form.type} onChange={set('type')}
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option value="used">Used Book</option>
                <option value="donation">Donation (Free)</option>
                <option value="ebook">Ebook Link</option>
              </select>
            </div>
          </div>

          {form.type === 'ebook' && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Ebook URL</label>
              <input required type="url" placeholder="https://..." value={form.ebookLink} onChange={set('ebookLink')}
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
          )}
          
          {err && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">{err}</p>}
          
          <button className="w-full py-3 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 transition">
            Submit for Approval
          </button>
        </form>
      )}
    </div>
  );
}