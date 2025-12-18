import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Search, Eye, X } from 'lucide-react'; // 1. Import thêm icon Eye (xem) và X (đóng)

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // 2. State cho Modal chi tiết
    const [selectedOrder, setSelectedOrder] = useState(null); // Lưu data đơn hàng đang xem
    const [loadingDetails, setLoadingDetails] = useState(false); // Loading khi đang lấy chi tiết

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

    // 3. Hàm xử lý khi bấm "View Details"
    const handleViewDetails = async (orderId) => {
        setLoadingDetails(true);
        try {
            // Gọi API getOrderDetails (Controller số 6)
            const res = await api.get(`/orders/${orderId}`);
            setSelectedOrder(res.data); // Lưu dữ liệu vào state để hiển thị Modal
        } catch (error) {
            alert("Failed to load order details");
            console.error(error);
        } finally {
            setLoadingDetails(false);
        }
    };

    // 4. Hàm đóng Modal
    const closeModal = () => {
        setSelectedOrder(null);
    };

    const filteredOrders = orders.filter(order => {
        const term = searchTerm.toLowerCase();
        return (
            order.id.toString().includes(term) ||
            (order.status && order.status.toLowerCase().includes(term)) ||
            (order.address && order.address.toLowerCase().includes(term)) ||
            order.total_money.toString().includes(term)
        );
    });

    if (loading) return <div className="text-center mt-10">Loading history...</div>;

    return (
        <div className="container mx-auto p-6 max-w-4xl relative">
            <h2 className="text-2xl font-bold mb-6">My Order History</h2>

            {/* THANH TÌM KIẾM */}
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

            {/* DANH SÁCH ĐƠN HÀNG */}
            {orders.length === 0 ? (
                <p className="text-center text-gray-500">You haven't placed any orders yet.</p>
            ) : filteredOrders.length === 0 ? (
                <p className="text-center text-gray-500">No orders found matching "{searchTerm}"</p>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map(order => (
                        <div key={order.id} className="bg-white p-6 rounded-lg shadow border border-gray-200 transition hover:shadow-md">
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
                                    <p className="text-sm text-gray-600 truncate max-w-xs">Ship to: {order.address}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-xl font-bold text-blue-600">
                                        ${order.total_money}
                                    </div>
                                    {/* Nút bấm xem chi tiết */}
                                    <button
                                        onClick={() => handleViewDetails(order.id)}
                                        className="flex items-center gap-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded transition"
                                    >
                                        <Eye size={18} />
                                        Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 5. MODAL CHI TIẾT (Chỉ hiển thị khi selectedOrder có dữ liệu) */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fadeIn">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 border-b">
                            <h3 className="text-xl font-bold">Order Details #{selectedOrder.id}</h3>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-4">
                            {/* Thông tin người nhận */}
                            <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded">
                                <div>
                                    <p className="text-gray-500">Receiver Name</p>
                                    <p className="font-semibold">{selectedOrder.full_name}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Phone</p>
                                    <p className="font-semibold">{selectedOrder.phone}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-gray-500">Address</p>
                                    <p className="font-semibold">{selectedOrder.address}</p>
                                </div>
                            </div>

                            {/* Danh sách sản phẩm (Table) */}
                            <div>
                                <h4 className="font-bold mb-3 text-gray-700">Items Ordered</h4>
                                <div className="border rounded-lg overflow-hidden">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-100 text-gray-600">
                                        <tr>
                                            <th className="p-3">Product</th>
                                            <th className="p-3 text-center">Qty</th>
                                            <th className="p-3 text-right">Price</th>
                                            <th className="p-3 text-right">Subtotal</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                        {/* Backend trả về items trong object */}
                                        {selectedOrder.items && selectedOrder.items.map((item, index) => (
                                            <tr key={index}>
                                                <td className="p-3 font-medium">{item.product_name}</td>
                                                <td className="p-3 text-center">x{item.quantity}</td>
                                                <td className="p-3 text-right text-gray-500">${item.price}</td>
                                                <td className="p-3 text-right font-semibold">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Tổng tiền */}
                            <div className="flex justify-end pt-4 border-t">
                                <div className="text-right">
                                    <p className="text-gray-500 text-sm">Total Amount</p>
                                    <p className="text-2xl font-bold text-blue-600">${selectedOrder.total_money}</p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 bg-gray-50 border-t flex justify-end">
                            <button
                                onClick={closeModal}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading Overlay khi đang fetch chi tiết */}
            {loadingDetails && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
            )}
        </div>
    );
}