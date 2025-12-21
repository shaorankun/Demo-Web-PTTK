import React, { useState, useEffect } from 'react';
import api from '../../api';
import {
    Search, Eye, X, Banknote, CreditCard, Package, Truck, CheckCircle, Clock, AlertTriangle, Calendar
} from 'lucide-react';

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    useEffect(() => {
        fetchMyOrders();
    }, []);

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

    const handleViewDetails = async (orderId) => {
        setLoadingDetails(true);
        try {
            const res = await api.get(`/orders/${orderId}`);
            setSelectedOrder(res.data);
        } catch (error) {
            alert("Failed to load order details");
        } finally {
            setLoadingDetails(false);
        }
    };

    const closeModal = () => setSelectedOrder(null);

    const filteredOrders = orders.filter(order => {
        const term = searchTerm.toLowerCase();
        return (
            order.id.toString().includes(term) ||
            (order.status && order.status.toLowerCase().includes(term)) ||
            (order.address && order.address.toLowerCase().includes(term)) ||
            order.total_money.toString().includes(term)
        );
    });

    // Helper: Màu sắc theo trạng thái
    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Processing': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Shipped': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
            case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
            case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    // Helper: Stepper trạng thái cho Modal
    const OrderStepper = ({ status }) => {
        const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
        const currentStepIndex = steps.indexOf(status);
        const isCancelled = status === 'Cancelled';

        if (isCancelled) {
            return (
                <div className="bg-red-50 p-4 rounded-xl border border-red-200 flex items-center justify-center gap-2 text-red-600 font-bold mb-6">
                    <AlertTriangle size={24} /> Order Cancelled
                </div>
            );
        }

        return (
            <div className="flex justify-between items-center mb-8 px-2">
                {steps.map((step, index) => {
                    const completed = index <= currentStepIndex;
                    const active = index === currentStepIndex;

                    return (
                        <div key={step} className="flex flex-col items-center relative z-10 w-1/4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                                completed
                                    ? 'bg-green-500 border-green-200 text-white shadow-lg shadow-green-200'
                                    : 'bg-white border-gray-200 text-gray-400'
                            }`}>
                                {index === 0 && <Clock size={16} />}
                                {index === 1 && <Package size={16} />}
                                {index === 2 && <Truck size={16} />}
                                {index === 3 && <CheckCircle size={16} />}
                            </div>
                            <span className={`text-xs mt-2 font-bold ${completed ? 'text-gray-800' : 'text-gray-400'}`}>{step}</span>

                            {/* Line connecting steps */}
                            {index < steps.length - 1 && (
                                <div className={`absolute top-5 left-1/2 w-full h-1 -z-10 ${
                                    index < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'
                                }`}></div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="container mx-auto p-6 max-w-5xl animate-fade-in min-h-screen">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-3">
                <Package className="text-blue-600" size={32} /> My Order History
            </h2>

            {/* THANH TÌM KIẾM */}
            <div className="mb-8 relative max-w-lg">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 w-full p-4 border border-gray-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                />
            </div>

            {/* DANH SÁCH ĐƠN HÀNG */}
            {filteredOrders.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
                    <Package size={64} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-xl font-medium text-gray-500">No orders found</p>
                    <p className="text-gray-400 text-sm mt-2">Try adjusting your search or place a new order.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {filteredOrders.map(order => (
                        <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group">
                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-50 p-3 rounded-xl text-blue-600 font-bold text-lg border border-blue-100">
                                        #{order.id}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                            <Calendar size={14} /> {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </div>
                                        <div className="font-semibold text-gray-800 flex items-center gap-2">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Total Amount</p>
                                    <p className="text-2xl font-bold text-gray-900">${new Intl.NumberFormat('en-US').format(order.total_money)}</p>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="space-y-2 text-sm">
                                    <p className="text-gray-600 flex items-center gap-2">
                                        <Truck size={16} className="text-gray-400" />
                                        <span className="truncate max-w-xs md:max-w-md" title={order.address}>{order.address}</span>
                                    </p>
                                    <p className="text-gray-600 flex items-center gap-2">
                                        {order.payment_method === 'BANK' ? <CreditCard size={16} className="text-blue-500" /> : <Banknote size={16} className="text-green-500" />}
                                        <span className="font-medium">
                                            {order.payment_method === 'BANK' ? 'Bank Transfer' : 'Cash on Delivery'}
                                        </span>
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleViewDetails(order.id)}
                                    className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-lg transition-all flex items-center gap-2"
                                >
                                    <Eye size={18} /> View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- MODAL CHI TIẾT --- */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal}></div>

                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative z-10 animate-scale-up">

                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white/90 backdrop-blur z-20">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800">Order #{selectedOrder.id}</h3>
                                <p className="text-sm text-gray-500">Placed on {new Date(selectedOrder.created_at).toLocaleString()}</p>
                            </div>
                            <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full transition">
                                <X size={24} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="p-8">
                            {/* Stepper Status */}
                            <OrderStepper status={selectedOrder.status} />

                            {/* Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Truck size={18}/> Delivery Info</h4>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between border-b border-gray-200 pb-2">
                                            <span className="text-gray-500">Receiver</span>
                                            <span className="font-semibold">{selectedOrder.full_name}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-200 pb-2">
                                            <span className="text-gray-500">Phone</span>
                                            <span className="font-semibold">{selectedOrder.phone}</span>
                                        </div>
                                        <div className="pt-1">
                                            <span className="text-gray-500 block mb-1">Address</span>
                                            <span className="font-semibold block leading-relaxed">{selectedOrder.address}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><CreditCard size={18}/> Payment Info</h4>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                                            <span className="text-gray-500">Method</span>
                                            {selectedOrder.payment_method === 'BANK' ? (
                                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold text-xs flex items-center gap-1">
                                                    <CreditCard size={12} /> BANK TRANSFER
                                                </span>
                                            ) : (
                                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-bold text-xs flex items-center gap-1">
                                                    <Banknote size={12} /> COD
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center pt-2">
                                            <span className="text-gray-500">Total Paid</span>
                                            <span className="text-xl font-bold text-green-600">${new Intl.NumberFormat('en-US').format(selectedOrder.total_money)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items Table */}
                            <div className="border border-gray-200 rounded-2xl overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold tracking-wider">
                                    <tr>
                                        <th className="p-4">Product</th>
                                        <th className="p-4 text-center">Qty</th>
                                        <th className="p-4 text-right">Unit Price</th>
                                        <th className="p-4 text-right">Total</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                    {selectedOrder.items && selectedOrder.items.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition">
                                            <td className="p-4 font-semibold text-gray-800">{item.product_name}</td>
                                            <td className="p-4 text-center bg-gray-50 font-mono text-gray-600">x{item.quantity}</td>
                                            <td className="p-4 text-right text-gray-500">${item.price}</td>
                                            <td className="p-4 text-right font-bold text-gray-800">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                    <tfoot className="bg-gray-50 border-t border-gray-200">
                                    <tr>
                                        <td colSpan="3" className="p-4 text-right font-bold text-gray-600">Grand Total</td>
                                        <td className="p-4 text-right font-extrabold text-xl text-blue-600">
                                            ${new Intl.NumberFormat('en-US').format(selectedOrder.total_money)}
                                        </td>
                                    </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 rounded-b-3xl">
                            <button
                                onClick={() => alert('Support Chat Feature Coming Soon!')}
                                className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 font-semibold transition"
                            >
                                Need Help?
                            </button>
                            <button
                                onClick={closeModal}
                                className="px-8 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-lg font-semibold transition shadow-blue-500/30"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading Overlay */}
            {loadingDetails && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-white/50 backdrop-blur-sm">
                    <div className="bg-white p-4 rounded-full shadow-xl">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            )}
        </div>
    );
}