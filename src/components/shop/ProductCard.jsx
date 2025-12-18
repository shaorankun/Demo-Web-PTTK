import React from 'react';
import { Package } from 'lucide-react';
import { Link } from 'react-router-dom'; // 1. Import Link

export default function ProductCard({ item, categoryName, onAddToCart }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition duration-300">
            {/* 2. Bấm vào Ảnh -> Sang trang chi tiết */}
            <Link to={`/product/${item.id}`}>
                <div className="bg-gray-200 h-48 rounded mb-4 flex items-center justify-center cursor-pointer overflow-hidden">
                    {/* Nếu item có image thì hiện image, ko thì hiện icon */}
                    {item.image && item.image !== 'https://placehold.co/400x300?text=No+Image' ? (
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover hover:scale-105 transition" />
                    ) : (
                        <Package className="w-16 h-16 text-gray-400" />
                    )}
                </div>
            </Link>

            {/* 3. Bấm vào Tên -> Sang trang chi tiết */}
            <Link to={`/product/${item.id}`}>
                <h3 className="text-xl font-semibold mb-2 hover:text-blue-600 cursor-pointer">
                    {item.name}
                </h3>
            </Link>

            <p className="text-gray-600 mb-2 line-clamp-2 h-12 text-sm">
                {item.description}
            </p>

            <p className="text-sm text-gray-500 mb-2">
                Category: <span className="font-medium text-gray-700">{categoryName}</span>
            </p>
            <p className="text-sm text-gray-500 mb-4">Stock: {item.stock}</p>

            <div className="flex justify-between items-center mt-4">
                <span className="text-2xl font-bold text-blue-600">${item.price}</span>
                <button
                    onClick={() => onAddToCart(item)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
}