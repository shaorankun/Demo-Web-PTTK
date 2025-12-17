import React from 'react';
import { Package } from 'lucide-react';

export default function ProductCard({ item, categoryName, onAddToCart }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="bg-gray-200 h-48 rounded mb-4 flex items-center justify-center">
                <Package className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
            <p className="text-gray-600 mb-2">{item.description}</p>
            <p className="text-sm text-gray-500 mb-2">
                Category: {categoryName}
            </p>
            <p className="text-sm text-gray-500 mb-4">Stock: {item.stock}</p>
            <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">${item.price}</span>
                <button
                    onClick={() => onAddToCart(item)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
}