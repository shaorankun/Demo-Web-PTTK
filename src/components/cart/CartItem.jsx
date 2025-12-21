import React from 'react';
import { Trash2, Package } from 'lucide-react'; // Import thêm Package để làm icon mặc định

export default function CartItem({ item, onUpdateQty, onRemove }) {
    // 1. Kiểm tra tồn kho (Logic cũ của bạn)
    const isMaxStock = item.quantity >= item.stock;

    // 2. Xử lý link ảnh (Logic MỚI)
    // Nếu có link thì dùng, không thì dùng placeholder
    const imageUrl = item.image && item.image.trim() !== ''
        ? item.image
        : 'https://placehold.co/150x150?text=No+Image';

    return (
        <div className="flex items-center justify-between border-b py-4 gap-4">

            {/* --- PHẦN HÌNH ẢNH (MỚI THÊM VÀO) --- */}
            <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-gray-200 relative group">
                <img
                    src={imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        // Nếu ảnh lỗi (404), tự động chuyển về ảnh placeholder
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/150x150?text=Error';
                    }}
                />
            </div>

            {/* Phần thông tin (Logic cũ của bạn) */}
            <div className="flex-1">
                <h3 className="font-semibold text-gray-800 line-clamp-1" title={item.name}>
                    {item.name}
                </h3>
                <p className="text-gray-600">${item.price}</p>
                <p className="text-xs text-gray-400 mt-1">Stock: {item.stock}</p>
            </div>

            {/* Phần nút bấm tăng giảm & xóa (Logic cũ của bạn) */}
            <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2 border rounded bg-gray-50 overflow-hidden">
                        <button
                            onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className={`px-3 py-1 transition-colors ${
                                item.quantity <= 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'hover:bg-gray-200 text-gray-600'
                            }`}
                        >
                            -
                        </button>

                        <span className="w-8 text-center font-medium">{item.quantity}</span>

                        <button
                            disabled={isMaxStock}
                            onClick={() => {
                                if (!isMaxStock) {
                                    onUpdateQty(item.id, item.quantity + 1);
                                }
                            }}
                            className={`px-3 py-1 transition-colors ${
                                isMaxStock
                                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                    : 'hover:bg-gray-200 text-gray-600'
                            }`}
                        >
                            +
                        </button>
                    </div>

                    {/* Thông báo lỗi Max Stock */}
                    {isMaxStock && (
                        <span className="text-[10px] font-bold text-red-500 mt-1">
                            Max reached
                        </span>
                    )}
                </div>

                <span className="font-semibold w-20 text-right text-gray-800">
                    ${(item.price * item.quantity).toFixed(2)}
                </span>

                <button
                    onClick={() => onRemove(item.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                    title="Remove item"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}