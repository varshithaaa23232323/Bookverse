import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <-- Import useAuth

const categories = [
  { key: 'used',     title: 'Second Hand Books',   desc: 'Pre-loved stories at student-friendly prices.',  emoji: '📚' },
  { key: 'new',      title: 'New Books',           desc: 'Fresh off the press. Smells like a new adventure.', emoji: '✨' },
  { key: 'ebook',    title: 'Ebooks',              desc: 'Instant access ebooks. Read anywhere, anytime.', emoji: '📱' },
  { key: 'donation', title: 'Free Donation Books', desc: 'Free books. Give a story a second life.',        emoji: '🎁' },
];

const reviews = [
  { name: "Ananya S.", text: "I donated my old college books here and got a classic in return. Love this community!" },
  { name: "Rahul M.", text: "Found my favorite sci-fi novel for just ₹150 in the Used section. Absolute steal!" },
  { name: "Priya K.", text: "The COD feature and clean UI make it so easy to order. Best book site I've used." }
];

export default function Landing() {
  const { user } = useAuth(); // <-- Get the user state

  return (
    <div className="bg-cream min-h-screen">
      
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-20 text-center">
        <span className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full bg-brand-100 text-brand-700 mb-6">
          Welcome to BookVerse
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6 text-ink">
          Read More.<br />
          <span className="text-brand-600">Spend Less.</span>
        </h1>
        <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Join India's fastest-growing community for book lovers. Buy new bestsellers, grab second-hand gems, or donate books to those in need.
        </p>
        
        {/* CONDITIONAL BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/shop" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-600 text-white font-bold text-lg hover:bg-brand-700 transition shadow-lg shadow-brand-500/30">
            Explore the Store
          </Link>
          
          {user ? (
            // If logged in, show a button to their respective dashboard
            <Link to={user.role === 'admin' ? '/admin' : '/my-orders'} className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white border border-neutral-300 text-ink font-bold text-lg hover:bg-neutral-50 transition">
              Go to {user.role === 'admin' ? 'Admin Dashboard' : 'My Orders'}
            </Link>
          ) : (
            // If not logged in, show Join for Free
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white border border-neutral-300 text-ink font-bold text-lg hover:bg-neutral-50 transition">
              Join for Free
            </Link>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-extrabold text-center mb-10">Browse by Category</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((c) => (
            <Link key={c.key} to={`/shop?type=${c.key}`}
              className="group bg-white rounded-3xl border border-neutral-200 p-8 hover:shadow-xl hover:shadow-brand-500/10 hover:border-brand-300 transition-all duration-300">
              <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                {c.emoji}
              </div>
              <h3 className="font-bold text-xl mb-2 text-ink">{c.title}</h3>
              <p className="text-neutral-500 leading-relaxed">{c.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Social Proof / Reviews Section */}
      <section className="bg-white border-y border-neutral-200 py-20 mt-10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold mb-12">Loved by Readers</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((r, i) => (
              <div key={i} className="bg-cream rounded-2xl p-8 border border-neutral-200 text-left relative">
                <div className="text-brand-500 text-2xl mb-4">★★★★★</div>
                <p className="text-neutral-700 italic mb-6">"{r.text}"</p>
                <p className="font-bold text-sm text-ink">— {r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-10 text-neutral-500 text-sm">
        <p>© {new Date().getFullYear()} BookVerse. Built for readers, by readers.</p>
      </footer>
    </div>
  );
}