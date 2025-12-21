import React, { useState, useEffect } from 'react';
import { Package, AlertCircle, CheckCircle, X, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProductCard({ item, categoryName, onAddToCart, cart = [] }) {
    const [toast, setToast] = useState(null);

    // Xử lý ảnh: Nếu không có ảnh thì dùng ảnh placeholder
    const imageUrl = item.image && item.image.trim() !== ''
        ? item.image
        : 'https://placehold.co/400x300?text=No+Image';

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 2000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const handleAddToCartClick = (e) => {
        e.preventDefault(); // Ngăn chặn Link nhảy trang khi bấm nút Add

        const existingItem = cart.find(c => c.id === item.id);
        const currentQtyInCart = existingItem ? existingItem.quantity : 0;

        if (currentQtyInCart + 1 > item.stock) {
            setToast({ type: 'error', message: `Max stock reached (${item.stock})` });
            return;
        }

        onAddToCart(item);
        setToast({ type: 'success', message: 'Added to cart!' });
    };

    return (
        <div className="relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100 group">

            {/* --- TOAST --- */}
            {toast && (
                <div className={`absolute top-2 left-2 right-2 z-20 flex items-center justify-between px-3 py-2 rounded shadow-md animate-fade-in ${
                    toast.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                    <div className="flex items-center gap-2 text-xs font-bold">
                        {toast.type === 'error' ? <AlertCircle size={14} /> : <CheckCircle size={14} />}
                        <span>{toast.message}</span>
                    </div>
                </div>
            )}

            {/* HÌNH ẢNH */}
            <Link to={`/product/${item.id}`} className="block overflow-hidden relative h-56 bg-gray-100 rounded-t-lg">
                <img
                    src={imageUrl}
                    alt={item.name}
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                        item.stock <= 0 ? 'grayscale opacity-60' : ''
                    }`}
                    onError={(e) => {
                        // Nếu link ảnh chết, tự động thay thế bằng ảnh placeholder
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/400x300?text=No+Image';
                    }}
                />

                {/* Out of Stock Overlay */}
                {item.stock <= 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                        <span className="text-white font-bold border-2 border-white px-4 py-1 uppercase tracking-wider">
                            Sold Out
                        </span>
                    </div>
                )}
            </Link>

            {/* CONTENT */}
            <div className="p-4 flex flex-col flex-grow">
                <div className="mb-2">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        {categoryName || 'General'}
                    </span>
                </div>

                <Link to={`/product/${item.id}`}>
                    <h3 className="text-lg font-bold text-gray-800 mb-1 hover:text-blue-600 transition line-clamp-1" title={item.name}>
                        {item.name}
                    </h3>
                </Link>

                <p className="text-gray-500 text-sm mb-4 line-clamp-2 min-h-[40px]">
                    {item.description || 'No description available.'}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                        <span className="block text-2xl font-bold text-gray-900">${item.price}</span>
                        <span className={`text-xs font-medium ${item.stock < 5 ? 'text-red-500' : 'text-green-600'}`}>
                            {item.stock} in stock
                        </span>
                    </div>

                    <button
                        onClick={handleAddToCartClick}
                        disabled={item.stock <= 0}
                        className={`p-3 rounded-full shadow-sm transition-colors ${
                            item.stock <= 0
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                        }`}
                        title="Add to Cart"
                    >
                        <ShoppingCart size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}