import React from 'react';
import { Trash2, AlertCircle } from 'lucide-react'; // Import thêm icon cảnh báo nếu muốn

export default function CartItem({ item, onUpdateQty, onRemove }) {
    // Kiểm tra xem đã chạm trần tồn kho chưa
    // Lưu ý: Cần đảm bảo object 'item' có trường 'stock' từ API/DB
    const isMaxStock = item.quantity >= item.stock;

    return (
        <div className="flex items-center justify-between border-b py-4">
            <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">${item.price}</p>
                {/* Hiển thị stock còn lại để user biết (Optional) */}
                <p className="text-xs text-gray-400 mt-1">Stock: {item.stock}</p>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1} // Không cho giảm dưới 1
                            className={`px-2 py-1 rounded ${
                                item.quantity <= 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                        >
                            -
                        </button>

                        <span className="w-8 text-center">{item.quantity}</span>

                        <button
                            // SỬA: Nếu chạm trần stock thì disable nút +
                            disabled={isMaxStock}
                            onClick={() => {
                                if (!isMaxStock) {
                                    onUpdateQty(item.id, item.quantity + 1);
                                }
                            }}
                            className={`px-2 py-1 rounded transition-colors ${
                                isMaxStock
                                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed' // Style khi bị disable
                                    : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                        >
                            +
                        </button>
                    </div>

                    {/* SỬA: Hiển thị thông báo lỗi nhỏ màu đỏ */}
                    {isMaxStock && (
                        <span className="text-xs text-red-500 mt-1">
                            Max quantity reached
                        </span>
                    )}
                </div>

                <span className="font-semibold w-20 text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                </span>

                <button
                    onClick={() => onRemove(item.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    title="Remove item"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}