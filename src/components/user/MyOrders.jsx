import React, { useState, useEffect } from 'react';
import api from '../../api';

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyOrders = async () => {
            try {
                const res = await api.get('/orders/my-orders');
                setOrders(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchMyOrders();
    }, []);

    if (loading) return <div className="text-center mt-10">Loading history...</div>;

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <h2 className="text-2xl font-bold mb-6">My Order History</h2>
            {orders.length === 0 ? (
                <p>You haven't placed any orders yet.</p>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white p-6 rounded-lg shadow border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <span className="font-bold text-lg">Order #{order.id}</span>
                                    <span className="text-gray-500 text-sm ml-2">
                                        ({new Date(order.created_at).toLocaleDateString()})
                                    </span>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                            'bg-blue-100 text-blue-800'
                                }`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="flex justify-between items-center border-t pt-4">
                                <div>
                                    <p className="text-sm text-gray-600">Ship to: {order.address}</p>
                                </div>
                                <div className="text-xl font-bold text-blue-600">
                                    Total: ${order.total_money}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}