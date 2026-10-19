import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try { await login(f.email, f.password); nav('/shop'); }
    catch (e) { setErr(e.response?.data?.message || 'Login failed'); }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-extrabold mb-1">Welcome back</h1>
      <p className="text-neutral-600 mb-8">Log in to browse and order.</p>
      <form onSubmit={submit} className="space-y-4">
        <input required type="email" placeholder="Email" value={f.email}
          onChange={(e) => setF({ ...f, email: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-500" />
        <input required type="password" placeholder="Password" value={f.password}
          onChange={(e) => setF({ ...f, password: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-500" />
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button className="w-full py-3 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700">Log in</button>
      </form>
      <p className="text-sm text-neutral-600 mt-6">
        No account? <Link to="/register" className="text-brand-600 font-semibold">Sign up</Link>
      </p>
    </div>
  );
}