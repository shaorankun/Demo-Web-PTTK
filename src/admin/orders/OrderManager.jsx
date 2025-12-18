import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Trash2, Eye } from 'lucide-react';

export default function OrderManager() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders'); // Route Admin Get All
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

    if (loading) return <div>Loading orders...</div>;

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-bold mb-6">Order Management</h2>
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
                    {orders.map(order => (
                        <tr key={order.id} className="border-t">
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
                                    className={`p-2 rounded border font-medium ${
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
                                <button onClick={() => handleDelete(order.id)} className="text-red-500 hover:text-red-700">
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}