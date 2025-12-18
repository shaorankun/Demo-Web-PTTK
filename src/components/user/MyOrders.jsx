import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Search } from 'lucide-react'; // 1. Import icon Search

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // 2. State cho tìm kiếm
    const [searchTerm, setSearchTerm] = useState('');

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

    // 3. Logic lọc danh sách đơn hàng
    const filteredOrders = orders.filter(order => {
        const term = searchTerm.toLowerCase();
        return (
            order.id.toString().includes(term) || // Tìm theo ID
            (order.status && order.status.toLowerCase().includes(term)) || // Tìm theo trạng thái
            (order.address && order.address.toLowerCase().includes(term)) || // Tìm theo địa chỉ
            order.total_money.toString().includes(term) // Tìm theo số tiền
        );
    });

    if (loading) return <div className="text-center mt-10">Loading history...</div>;

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <h2 className="text-2xl font-bold mb-6">My Order History</h2>

            {/* 4. THANH TÌM KIẾM */}
            <div className="mb-6 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search by Order ID, Status, or Address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>

            {/* Hiển thị danh sách hoặc thông báo rỗng */}
            {orders.length === 0 ? (
                <p className="text-center text-gray-500">You haven't placed any orders yet.</p>
            ) : filteredOrders.length === 0 ? (
                <p className="text-center text-gray-500">No orders found matching "{searchTerm}"</p>
            ) : (
                <div className="space-y-4">
                    {/* Dùng filteredOrders để map */}
                    {filteredOrders.map(order => (
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
                                            order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
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