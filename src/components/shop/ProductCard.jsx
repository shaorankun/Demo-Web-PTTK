import React, { useState, useEffect } from 'react';
import { Package, AlertCircle, CheckCircle, X } from 'lucide-react'; // Import thêm icon thông báo
import { Link } from 'react-router-dom';

// 1. NHẬN THÊM PROP 'cart' ĐỂ CHECK STOCK
export default function ProductCard({ item, categoryName, onAddToCart, cart = [] }) {

    // 2. State quản lý thông báo (Toast) riêng cho từng thẻ
    const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: '' }

    // Tự động tắt thông báo sau 2 giây
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 2000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    // 3. Hàm xử lý khi bấm nút Add
    const handleAddToCartClick = () => {
        // Tìm xem sản phẩm này đã có trong giỏ chưa
        const existingItem = cart.find(c => c.id === item.id);
        const currentQtyInCart = existingItem ? existingItem.quantity : 0;

        // KIỂM TRA STOCK
        if (currentQtyInCart + 1 > item.stock) {
            setToast({
                type: 'error',
                message: `Max stock reached (${item.stock})`
            });
            return; // Dừng, không thêm
        }

        // Nếu OK -> Gọi hàm thêm của cha
        onAddToCart(item);

        // Hiện thông báo thành công
        setToast({
            type: 'success',
            message: 'Added to cart!'
        });
    };

    return (
        // Thêm 'relative' để định vị thông báo (absolute) nằm bên trong thẻ này
        <div className="relative bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition duration-300">

            {/* --- PHẦN THÔNG BÁO (TOAST) --- */}
            {toast && (
                <div className={`absolute top-2 left-2 right-2 z-10 flex items-center justify-between px-3 py-2 rounded shadow-md animate-fade-in ${
                    toast.type === 'error'
                        ? 'bg-red-100 text-red-700 border border-red-200'
                        : 'bg-green-100 text-green-700 border border-green-200'
                }`}>
                    <div className="flex items-center gap-2 text-sm font-medium">
                        {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
                        <span>{toast.message}</span>
                    </div>
                    <button onClick={() => setToast(null)} className="opacity-60 hover:opacity-100">
                        <X size={14} />
                    </button>
                </div>
            )}
            {/* ------------------------------- */}

            {/* Bấm vào Ảnh -> Sang trang chi tiết */}
            <Link to={`/product/${item.id}`}>
                <div className="bg-gray-200 h-48 rounded mb-4 flex items-center justify-center cursor-pointer overflow-hidden relative">
                    {item.image && item.image !== 'https://placehold.co/400x300?text=No+Image' ? (
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover hover:scale-105 transition" />
                    ) : (
                        <Package className="w-16 h-16 text-gray-400" />
                    )}

                    {/* Hiển thị nhãn Hết hàng nếu stock = 0 */}
                    {item.stock <= 0 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="text-white font-bold text-lg uppercase border-2 border-white px-4 py-1">Out of Stock</span>
                        </div>
                    )}
                </div>
            </Link>

            {/* Bấm vào Tên -> Sang trang chi tiết */}
            <Link to={`/product/${item.id}`}>
                <h3 className="text-xl font-semibold mb-2 hover:text-blue-600 cursor-pointer line-clamp-1" title={item.name}>
                    {item.name}
                </h3>
            </Link>

            <p className="text-gray-600 mb-2 line-clamp-2 h-10 text-sm">
                {item.description}
            </p>

            <div className="flex justify-between text-sm text-gray-500 mb-4">
                <p>Cat: <span className="font-medium text-gray-700">{categoryName}</span></p>
                <p>Stock: <span className={`font-medium ${item.stock < 5 ? 'text-red-500' : 'text-gray-700'}`}>{item.stock}</span></p>
            </div>

            <div className="flex justify-between items-center mt-4 border-t pt-4">
                <span className="text-2xl font-bold text-blue-600">${item.price}</span>
                <button
                    // SỬA: Gọi hàm handleAddToCartClick thay vì onAddToCart trực tiếp
                    onClick={handleAddToCartClick}
                    disabled={item.stock <= 0} // Disable nút nếu hết hàng
                    className={`px-4 py-2 rounded shadow transition ${
                        item.stock <= 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                    {item.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        </div>
    );
}