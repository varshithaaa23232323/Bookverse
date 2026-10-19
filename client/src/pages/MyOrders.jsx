import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders/my').then((r) => setOrders(r.data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-neutral-500 bg-white p-6 rounded-2xl border border-neutral-200">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-start mb-4 border-b border-neutral-100 pb-3">
                <div>
                  <p className="text-xs text-neutral-500">Order ID: {order._id}</p>
                  <p className="text-sm font-semibold">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded">{order.status}</span>
              </div>
              <div className="space-y-2 mb-4">
                {order.items.map((item, i) => (
                  <p key={i} className="text-sm text-neutral-700">{item.quantity} x {item.title} (₹{item.price})</p>
                ))}
              </div>
              <p className="font-bold text-right">Total: ₹{order.totalAmount}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}