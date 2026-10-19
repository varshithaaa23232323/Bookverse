import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import BookCard from '../components/BookCard';

const tabs = [
  { key: '',         label: 'All Books' },
  { key: 'used',     label: 'Second Hand Books' },
  { key: 'new',      label: 'New Books' },
  { key: 'ebook',    label: 'Ebooks' },
  { key: 'donation', label: 'Free Donation Books' },
];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const active = params.get('type') || '';
  const urlSearch = params.get('q') || '';
  
  const [books, setBooks] = useState([]);
  const [q, setQ] = useState(urlSearch);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setQ(urlSearch); // Update local search box if URL changes
  }, [urlSearch]);

  useEffect(() => {
    setLoading(true);
    api.get(`/books${active ? `?type=${active}` : ''}`)
      .then((r) => setBooks(r.data))
      .finally(() => setLoading(false));
  }, [active]);

  const filtered = books.filter(
    (b) => b.title.toLowerCase().includes(q.toLowerCase()) || b.author.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-1">Browse the shelf</h1>
      <p className="text-neutral-600 mb-6">Pick a section and dive in.</p>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        {tabs.map((t) => (
          <button key={t.key}
            onClick={() => {
              if (t.key) setParams({ type: t.key });
              else setParams({});
            }}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition
              ${active === t.key ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-neutral-500">Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-neutral-500">
          <p className="text-5xl mb-3">📭</p>
          <p>No books found matching "{q}".</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((b) => <BookCard key={b._id} book={b} />)}
        </div>
      )}
    </div>
  );
}