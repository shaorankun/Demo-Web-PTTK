import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { Search } from 'lucide-react'; // 1. Import icon Search

export default function ShopView({ equipment, categories, onAddToCart }) {
    // 2. State lưu từ khóa tìm kiếm
    const [searchTerm, setSearchTerm] = useState('');

    // Nếu data chưa load xong thì hiện Loading
    if (!equipment) {
        return <div className="text-center py-10">Loading products...</div>;
    }

    // 3. Logic lọc sản phẩm
    const filteredProducts = equipment.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-3xl font-bold">Products</h2>

                {/* 4. Thanh Search Giao diện */}
                <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
            </div>

            {/* 5. Hiển thị danh sách đã lọc */}
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map(item => {
                        const catName = item.category_name || categories.find(c => c.id === item.categoryId)?.name || 'Uncategorized';

                        return (
                            <ProductCard
                                key={item.id}
                                item={item}
                                categoryName={catName}
                                onAddToCart={onAddToCart}
                            />
                        );
                    })}
                </div>
            ) : (
                // Hiển thị nếu không tìm thấy sản phẩm nào
                <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-500 text-lg">No products found matching "{searchTerm}"</p>
                    <button
                        onClick={() => setSearchTerm('')}
                        className="mt-4 text-blue-600 hover:underline font-medium"
                    >
                        Clear search
                    </button>
                </div>
            )}
        </div>
    );
}