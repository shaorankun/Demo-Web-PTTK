import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Search, AlertCircle, CheckCircle, X } from 'lucide-react'; // Import thêm icon thông báo

// 1. THÊM PROP 'cart' ĐỂ CHECK SỐ LƯỢNG
export default function ShopView({ equipment, categories, cart, onAddToCart }) {
    const [searchTerm, setSearchTerm] = useState('');

    // 2. State cho thông báo (Toast)
    const [toast, setToast] = useState(null); // { message: '', type: 'success' | 'error' }

    // Tự động tắt thông báo sau 3 giây
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    // 3. HÀM XỬ LÝ LOGIC CHECK STOCK
    const handleAddToCartWrapper = (product) => {
        // Tìm xem sản phẩm này đã có trong giỏ chưa
        const existingItem = cart.find(item => item.id === product.id);
        const currentQtyInCart = existingItem ? existingItem.quantity : 0;

        // Nếu (số lượng trong giỏ + 1) lớn hơn tồn kho thực tế -> BÁO LỖI
        if (currentQtyInCart + 1 > product.stock) {
            setToast({
                type: 'error',
                message: `Cannot add more! Only ${product.stock} items available.`
            });
            return; // Dừng lại, không gọi onAddToCart
        }

        // Nếu hợp lệ -> Gọi hàm gốc và BÁO THÀNH CÔNG
        onAddToCart(product);
        setToast({
            type: 'success',
            message: `Added "${product.name}" to cart successfully!`
        });
    };

    if (!equipment) {
        return <div className="text-center py-10">Loading products...</div>;
    }

    const filteredProducts = equipment.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="relative"> {/* Thêm relative để định vị Toast */}

            {/* --- PHẦN THÔNG BÁO (TOAST) --- */}
            {toast && (
                <div className={`fixed top-20 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded shadow-lg animate-bounce-in border-l-4 ${
                    toast.type === 'error'
                        ? 'bg-white border-red-500 text-red-700'
                        : 'bg-white border-green-500 text-green-700'
                }`}>
                    {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                    <span className="font-medium">{toast.message}</span>
                    <button onClick={() => setToast(null)} className="ml-2 opacity-50 hover:opacity-100">
                        <X size={16} />
                    </button>
                </div>
            )}
            {/* ------------------------------- */}

            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-3xl font-bold">Products</h2>
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

            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map(item => {
                        const catName = item.category_name || categories.find(c => c.id === item.categoryId)?.name || 'Uncategorized';

                        return (
                            <ProductCard
                                key={item.id}
                                item={item}
                                categoryName={catName}
                                // 4. TRUYỀN HÀM WRAPPER THAY VÌ HÀM GỐC
                                onAddToCart={handleAddToCartWrapper}
                            />
                        );
                    })}
                </div>
            ) : (
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