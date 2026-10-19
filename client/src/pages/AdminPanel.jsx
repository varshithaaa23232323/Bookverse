import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminPanel() {
  const [pending, setPending] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]); // NEW
  
  const [form, setForm] = useState({ title: '', author: '', price: 0, type: 'new', coverImage: '', ebookLink: '' });
  const [editId, setEditId] = useState(null);
  const [err, setErr] = useState('');

  const loadData = async () => {
    const pendingRes = await api.get('/admin/pending');
    const booksRes = await api.get('/admin/books');
    const ordersRes = await api.get('/orders');
    const usersRes = await api.get('/admin/users'); // NEW
    
    setPending(pendingRes.data);
    setAllBooks(booksRes.data);
    setOrders(ordersRes.data);
    setUsers(usersRes.data); // NEW
  };

  useEffect(() => { loadData(); }, []);

  // Calculate Total Revenue
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  const handleAction = async (id, action) => {
    try {
      await api.patch(`/admin/books/${id}/${action}`);
      loadData(); 
    } catch (e) { alert('Action failed'); }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await api.delete(`/admin/books/${id}`);
      loadData();
    } catch (e) { alert('Delete failed'); }
  };

  const handleEditClick = (book) => {
    setEditId(book._id);
    setForm({
      title: book.title,
      author: book.author,
      price: book.price,
      type: book.type,
      coverImage: book.coverImage,
      ebookLink: book.ebookLink || ''
    });
    window.scrollTo(0, 0);
  };

  const submitBook = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      if (editId) {
        await api.put(`/admin/books/${editId}`, { ...form, price: Number(form.price) });
        setEditId(null);
      } else {
        await api.post('/admin/books', { ...form, price: Number(form.price) });
      }
      setForm({ title: '', author: '', price: 0, type: 'new', coverImage: '', ebookLink: '' });
      loadData();
    } catch (e) { setErr(e.response?.data?.message || 'Failed'); }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      loadData();
    } catch (e) { alert('Failed to update status'); }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">
      
      {/* NEW: STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200 p-6 rounded-2xl shadow-sm">
          <p className="text-neutral-500 text-sm font-semibold mb-1">Total Revenue</p>
          <p className="text-3xl font-extrabold text-brand-600">₹{totalRevenue}</p>
        </div>
        <div className="bg-white border border-neutral-200 p-6 rounded-2xl shadow-sm">
          <p className="text-neutral-500 text-sm font-semibold mb-1">Total Orders</p>
          <p className="text-3xl font-extrabold text-ink">{orders.length}</p>
        </div>
        <div className="bg-white border border-neutral-200 p-6 rounded-2xl shadow-sm">
          <p className="text-neutral-500 text-sm font-semibold mb-1">Books in Store</p>
          <p className="text-3xl font-extrabold text-ink">{allBooks.length}</p>
        </div>
        <div className="bg-white border border-neutral-200 p-6 rounded-2xl shadow-sm">
          <p className="text-neutral-500 text-sm font-semibold mb-1">Total Users</p>
          <p className="text-3xl font-extrabold text-ink">{users.length}</p>
        </div>
      </div>

      {/* 1. PENDING REQUESTS */}
      <div>
        <h2 className="text-2xl font-extrabold mb-4 text-brand-700">Pending User Requests ({pending.length})</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {pending.length === 0 ? <p className="text-neutral-500">No pending submissions.</p> : null}
          {pending.map((b) => (
            <div key={b._id} className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-4">
              <img src={b.coverImage} className="w-16 h-24 object-cover rounded shadow-sm" alt="" />
              <div className="flex-1">
                <p className="font-bold">{b.title}</p>
                <p className="text-sm text-neutral-600">{b.author} · ₹{b.price} · {b.type}</p>
                <p className="text-xs text-neutral-500 mt-1">Requested by: {b.submittedBy?.name || 'Unknown'}</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => handleAction(b._id, 'approve')} className="px-3 py-1 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700">Approve</button>
                  <button onClick={() => handleAction(b._id, 'reject')} className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. ADD / EDIT BOOK FORM */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-2xl font-extrabold mb-4">{editId ? 'Edit Book' : 'Add New Book to Store'}</h2>
        <form onSubmit={submitBook} className="grid md:grid-cols-2 gap-4">
          <input required placeholder="Title" value={form.title} onChange={set('title')} className="px-4 py-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-500" />
          <input required placeholder="Author" value={form.author} onChange={set('author')} className="px-4 py-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-500" />
          <input placeholder="Cover Image URL" value={form.coverImage} onChange={set('coverImage')} className="px-4 py-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-500" />
          
          <div className="flex gap-2">
            <input type="number" min="0" placeholder="Price" value={form.price} onChange={set('price')} className="w-1/2 px-4 py-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-500" />
            <select value={form.type} onChange={set('type')} className="w-1/2 px-4 py-2.5 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500">
              <option value="new">New Book</option>
              <option value="used">Used Book</option>
              <option value="donation">Donation</option>
              <option value="ebook">Ebook</option>
            </select>
          </div>

          {form.type === 'ebook' && (
            <input required placeholder="Ebook Link" value={form.ebookLink} onChange={set('ebookLink')} className="px-4 py-2.5 rounded-lg border border-neutral-300 md:col-span-2 focus:outline-none focus:ring-2 focus:ring-brand-500" />
          )}

          {err && <p className="text-sm text-red-600 md:col-span-2">{err}</p>}
          
          <div className="md:col-span-2 flex gap-3">
            <button className="px-6 py-3 rounded-lg bg-brand-600 text-white font-semibold hover:bg-brand-700 transition">
              {editId ? 'Save Changes' : 'Add Book'}
            </button>
            {editId && (
              <button type="button" onClick={() => { setEditId(null); setForm({ title: '', author: '', price: 0, type: 'new', coverImage: '', ebookLink: '' }); }} className="px-6 py-3 rounded-lg border border-neutral-300 font-semibold hover:bg-neutral-100 transition">
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 3. RECENT ORDERS */}
      <div>
        <h2 className="text-2xl font-extrabold mb-4">Recent Orders ({orders.length})</h2>
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Items</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {orders.map((o) => (
                <tr key={o._id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <p className="font-semibold">{o.user?.name || 'Unknown'}</p>
                    <p className="text-xs text-neutral-500">{o.user?.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    {o.items.map((item, i) => (
                      <p key={i} className="text-xs">{item.quantity}x {item.title}</p>
                    ))}
                  </td>
                  <td className="px-4 py-3 font-bold">₹{o.totalAmount}</td>
                  <td className="px-4 py-3">
                    <select 
                      value={o.status} 
                      onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                      className={`text-xs font-bold px-2 py-1 rounded cursor-pointer border-none outline-none ${
                        o.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 
                        o.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 
                        'bg-amber-100 text-amber-800'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. MANAGE STORE (ALL BOOKS) */}
      <div>
        <h2 className="text-2xl font-extrabold mb-4">Manage Store ({allBooks.length} Books)</h2>
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-4 py-3 font-semibold">Book</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {allBooks.map((b) => (
                <tr key={b._id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3 flex items-center gap-3">
                    <img src={b.coverImage} className="w-8 h-10 object-cover rounded" alt="" />
                    <div>
                      <p className="font-semibold text-ink">{b.title}</p>
                      <p className="text-xs text-neutral-500">{b.author}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 uppercase text-xs font-bold text-brand-600">{b.type}</td>
                  <td className="px-4 py-3">₹{b.price}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleEditClick(b)} className="text-brand-600 hover:underline mr-4 font-medium">Edit</button>
                    <button onClick={() => handleDelete(b._id)} className="text-red-600 hover:underline font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}