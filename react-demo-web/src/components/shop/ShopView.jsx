import React from 'react';
import ProductCard from './ProductCard';

export default function ShopView({ equipment, categories, onAddToCart }) {

    // Nếu data chưa load xong thì hiện Loading
    if (!equipment || equipment.length === 0) {
        return <div className="text-center py-10">Loading products... (Make sure Backend is running at port 4000)</div>;
    }

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {equipment.map(item => {
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
        </div>
    );
}