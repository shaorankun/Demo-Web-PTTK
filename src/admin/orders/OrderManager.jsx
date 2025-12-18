import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Trash2, Eye, Search } from 'lucide-react'; // 1. Import Search

export default function OrderManager() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // 2. State cho tìm kiếm
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders');
            setOrders(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Lỗi tải đơn hàng", error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Xóa đơn hàng này?")) return;
        try {
            await api.delete(`/orders/${id}`);
            setOrders(orders.filter(o => o.id !== id));
        } catch (error) {
            alert("Lỗi khi xóa");
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.put(`/orders/${id}`, { status: newStatus });
            setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
            alert("Đã cập nhật trạng thái!");
        } catch (error) {
            alert("Lỗi cập nhật");
        }
    };

    // 3. Logic lọc đơn hàng
    const filteredOrders = orders.filter(order => {
        const term = searchTerm.toLowerCase();
        return (
            order.id.toString().includes(term) || // Tìm theo ID
            (order.full_name && order.full_name.toLowerCase().includes(term)) || // Tìm theo tên
            (order.phone && order.phone.includes(term)) || // Tìm theo sđt
            (order.status && order.status.toLowerCase().includes(term)) // Tìm theo trạng thái
        );
    });

    if (loading) return <div className="p-10 text-center text-gray-500">Loading orders...</div>;

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-bold mb-6">Order Management</h2>

            {/* 4. UI THANH TÌM KIẾM */}
            <div className="mb-6 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search orders by ID, Customer Name, Phone or Status..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>

            <div className="bg-white rounded shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="p-4 text-left">ID</th>
                        <th className="p-4 text-left">Customer</th>
                        <th className="p-4 text-left">Total</th>
                        <th className="p-4 text-left">Status</th>
                        <th className="p-4 text-left">Date</th>
                        <th className="p-4 text-left">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {/* Sử dụng filteredOrders thay vì orders */}
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map(order => (
                            <tr key={order.id} className="border-t hover:bg-gray-50">
                                <td className="p-4">#{order.id}</td>
                                <td className="p-4">
                                    <div className="font-bold">{order.full_name}</div>
                                    <div className="text-sm text-gray-500">{order.phone}</div>
                                </td>
                                <td className="p-4 font-bold text-green-600">${order.total_money}</td>
                                <td className="p-4">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        className={`p-2 rounded border font-medium cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none ${
                                            order.status === 'Pending' ? 'text-yellow-600 bg-yellow-50' :
                                                order.status === 'Delivered' ? 'text-green-600 bg-green-50' :
                                                    order.status === 'Cancelled' ? 'text-red-600 bg-red-50' : 'text-blue-600 bg-blue-50'
                                        }`}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td className="p-4 text-gray-500">
                                    {new Date(order.created_at).toLocaleDateString()}
                                </td>
                                <td className="p-4 flex gap-2">
                                    {/* Bạn có thể thêm nút xem chi tiết ở đây nếu cần */}
                                    {/* <button className="text-blue-500 hover:text-blue-700"><Eye size={18} /></button> */}

                                    <button
                                        onClick={() => handleDelete(order.id)}
                                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded"
                                        title="Delete Order"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="p-8 text-center text-gray-500">
                                No orders found matching "{searchTerm}"
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}