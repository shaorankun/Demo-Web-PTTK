import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Trash2, Eye, Search, Banknote, CreditCard } from 'lucide-react';

export default function OrderManager() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
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
            console.error("Error loading orders", error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this order?")) return;
        try {
            await api.delete(`/orders/${id}`);
            setOrders(orders.filter(o => o.id !== id));
            alert("Delete order successfully");
        } catch (error) {
            alert("Error while deleting");
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            // Optimistic update: Cập nhật UI ngay lập tức cho mượt
            setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));

            await api.put(`/orders/${id}`, { status: newStatus });
            // Không cần alert mỗi lần đổi để trải nghiệm mượt hơn, hoặc dùng toast
        } catch (error) {
            alert("Lỗi cập nhật");
            fetchOrders(); // Revert lại nếu lỗi
        }
    };

    const filteredOrders = orders.filter(order => {
        const term = searchTerm.toLowerCase();
        return (
            order.id.toString().includes(term) ||
            (order.full_name && order.full_name.toLowerCase().includes(term)) ||
            (order.phone && order.phone.includes(term)) ||
            (order.status && order.status.toLowerCase().includes(term)) ||
            (order.payment_method && order.payment_method.toLowerCase().includes(term))
        );
    });

    // Helper để lấy màu cho Status Badge
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Pending': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
            case 'Processing': return 'text-blue-700 bg-blue-50 border-blue-200';
            case 'Shipped': return 'text-indigo-700 bg-indigo-50 border-indigo-200';
            case 'Delivered': return 'text-green-700 bg-green-50 border-green-200';
            case 'Cancelled': return 'text-red-700 bg-red-50 border-red-200';
            default: return 'text-gray-700 bg-gray-50 border-gray-200';
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-2"></div>
            Loading orders...
        </div>
    );

    return (
        <div className="w-full min-h-screen p-6 bg-gray-50 animate-fade-in">
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-3xl font-bold text-gray-800">Order Management</h2>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-sm text-gray-500">
                    Total Orders: <span className="font-bold text-gray-800">{orders.length}</span>
                </div>
            </div>

            {/* --- SEARCH BAR --- */}
            <div className="mb-6 relative max-w-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search by ID, Customer, Status..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-300"
                />
            </div>

            {/* --- TABLE CONTAINER --- */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Payment</th>
                            <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="p-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map(order => (
                                <tr key={order.id} className="hover:bg-blue-50 transition-colors duration-200 group">

                                    {/* ID */}
                                    <td className="p-4 font-mono text-sm text-gray-500 font-semibold">
                                        #{order.id}
                                    </td>

                                    {/* Customer Info */}
                                    <td className="p-4">
                                        <div className="font-bold text-gray-800">{order.full_name}</div>
                                        <div className="text-xs text-gray-500 mt-0.5">{order.phone}</div>
                                    </td>

                                    {/* Total Money */}
                                    <td className="p-4 font-bold text-gray-800">
                                        ${new Intl.NumberFormat('en-US').format(order.total_money)}
                                    </td>

                                    {/* Payment Method */}
                                    <td className="p-4">
                                        {order.payment_method === 'BANK' ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                                                    <CreditCard size={14} /> BANK
                                                </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-green-50 text-green-700 border border-green-100">
                                                    <Banknote size={14} /> COD
                                                </span>
                                        )}
                                    </td>

                                    {/* Status Dropdown (Styled) */}
                                    <td className="p-4">
                                        <div className="relative">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                className={`appearance-none pl-3 pr-8 py-1.5 rounded-full text-xs font-bold border cursor-pointer focus:ring-2 focus:ring-offset-1 focus:outline-none transition-all ${getStatusStyle(order.status)}`}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                            {/* Custom Arrow Icon */}
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Date */}
                                    <td className="p-4 text-sm text-gray-500">
                                        {new Date(order.created_at).toLocaleDateString()}
                                        <div className="text-xs text-gray-400">
                                            {new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                    </td>

                                    {/* Actions */}
                                    <td className="p-4">
                                        <div className="flex justify-end gap-2">
                                            {/* View Detail Button (Placeholder for future Modal) */}
                                            <button
                                                onClick={() => alert(`View details for order #${order.id} coming soon!`)}
                                                className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-2 rounded-full transition-all"
                                                title="View Detail"
                                            >
                                                <Eye size={18} />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(order.id)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-100 p-2 rounded-full transition-all"
                                                title="Delete Order"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="p-10 text-center text-gray-400 italic">
                                    No orders found matching "{searchTerm}"
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}