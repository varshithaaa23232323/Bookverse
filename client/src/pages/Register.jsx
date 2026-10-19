import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try { await register(f.name, f.email, f.password); nav('/shop'); }
    catch (e) { setErr(e.response?.data?.message || 'Signup failed'); }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-extrabold mb-1">Create account</h1>
      <p className="text-neutral-600 mb-8">Start buying, selling and donating books.</p>
      <form onSubmit={submit} className="space-y-4">
        {['name','email','password'].map((k) => (
          <input key={k} required type={k === 'password' ? 'password' : k === 'email' ? 'email' : 'text'}
            placeholder={k[0].toUpperCase() + k.slice(1)} value={f[k]}
            onChange={(e) => setF({ ...f, [k]: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-500" />
        ))}
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button className="w-full py-3 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700">Sign up</button>
      </form>
      <p className="text-sm text-neutral-600 mt-6">
        Have an account? <Link to="/login" className="text-brand-600 font-semibold">Log in</Link>
      </p>
    </div>
  );
}