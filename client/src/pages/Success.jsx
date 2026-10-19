import { Link } from 'react-router-dom';

export default function Success() {
  // Get the order we just saved
  const lastOrder = JSON.parse(localStorage.getItem('lastOrder'));

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-6">✅</div>
      <h1 className="text-4xl font-extrabold mb-2 text-brand-600">Order Placed!</h1>
      <p className="text-neutral-600 mb-8">
        Thank you{lastOrder?.details?.name ? `, ${lastOrder.details.name}` : ''}! 
        Your books will be delivered to your address soon. Please keep <b>₹{lastOrder?.total}</b> ready for Cash on Delivery.
      </p>
      <Link to="/shop" className="px-8 py-3 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 transition">
        Continue Shopping
      </Link>
    </div>
  );
}
