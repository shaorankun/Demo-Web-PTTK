import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Search, AlertCircle, CheckCircle, X, ShoppingBag, Zap, Filter, RefreshCw } from 'lucide-react';

// 1. NHẬN THÊM PROP 'isLoading' VÀ 'onRefresh'
export default function ShopView({ equipment, categories, cart, onAddToCart, isLoading, onRefresh }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [toast, setToast] = useState(null);

    // 2. TỰ ĐỘNG GỌI HÀM REFRESH KHI VÀO TRANG (Fix lỗi phải reload)
    useEffect(() => {
        if (onRefresh) {
            onRefresh();
        }
    }, []); // Chạy 1 lần khi component được mount

    // Tự động tắt toast
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const handleAddToCartWrapper = (product) => {
        const existingItem = cart.find(item => item.id === product.id);
        const currentQtyInCart = existingItem ? existingItem.quantity : 0;

        if (currentQtyInCart + 1 > product.stock) {
            setToast({ type: 'error', message: `Limited stock! Only ${product.stock} items left.` });
            return;
        }

        onAddToCart(product);
        setToast({ type: 'success', message: `Added "${product.name}" to bag.` });
    };

    // 3. LOGIC LỌC SẢN PHẨM (Search + Category)
    const filteredProducts = equipment ? equipment.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));

        // Lấy tên category (xử lý logic API trả về id hay name)
        const itemCatId = item.category_id || item.categoryId;
        const itemCatName = item.category_name || categories.find(c => c.id === itemCatId)?.name;

        const matchesCategory = selectedCategory === 'All' || itemCatName === selectedCategory;

        return matchesSearch && matchesCategory;
    }) : [];

    // --- RENDER LOADING (Xử lý prop isLoading từ cha truyền xuống) ---
    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 text-blue-600">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
                <p className="font-semibold animate-pulse">Updating latest products...</p>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-gray-50 pb-20 animate-fade-in">

            {/* --- TOAST NOTIFICATION --- */}
            {toast && (
                <div className={`fixed top-24 right-6 z-50 flex items-center gap-4 px-5 py-4 rounded-xl shadow-2xl border backdrop-blur-md transition-all duration-500 animate-slide-left ${
                    toast.type === 'error' ? 'bg-white/95 border-red-200 text-red-700' : 'bg-white/95 border-green-200 text-green-700'
                }`}>
                    <div className={`p-2 rounded-full ${toast.type === 'error' ? 'bg-red-100' : 'bg-green-100'}`}>
                        {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                    </div>
                    <div>
                        <h4 className="font-bold text-sm">{toast.type === 'error' ? 'Oops!' : 'Success'}</h4>
                        <p className="text-xs opacity-90">{toast.message}</p>
                    </div>
                </div>
            )}

            {/* --- HERO & FILTER HEADER --- */}
            <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
                <div className="max-w-[1920px] mx-auto">

                    {/* Top Bar: Title & Search */}
                    <div className="px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-2.5 rounded-xl shadow-lg shadow-blue-500/30">
                                <ShoppingBag size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Marketplace</h1>
                                <p className="text-xs text-gray-500 font-medium">Original Equipment & Gear</p>
                            </div>
                        </div>

                        <div className="relative w-full md:w-[450px] group">
                            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search equipment, gear, models..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 w-full p-3 bg-gray-100 border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
                            />
                        </div>
                    </div>

                    {/* Bottom Bar: Category Filters (Scroll ngang) */}
                    <div className="px-6 pb-4 flex items-center gap-2 overflow-x-auto no-scrollbar">
                        <Filter size={16} className="text-gray-400 mr-2 flex-shrink-0" />

                        <button
                            onClick={() => setSelectedCategory('All')}
                            className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                                selectedCategory === 'All'
                                    ? 'bg-gray-900 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            All Products
                        </button>

                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.name)}
                                className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                                    selectedCategory === cat.name
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                                        : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- PRODUCT GRID --- */}
            <div className="max-w-[1920px] mx-auto px-6 py-8">
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                        {filteredProducts.map(item => {
                            const catName = item.category_name || categories.find(c => c.id === item.categoryId)?.name || 'General';
                            return (
                                <ProductCard
                                    key={item.id}
                                    item={item}
                                    categoryName={catName}
                                    onAddToCart={handleAddToCartWrapper}
                                />
                            );
                        })}
                    </div>
                ) : (
                    // Empty State "Oách"
                    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
                        <div className="bg-white p-8 rounded-full shadow-xl mb-6 relative">
                            <Search size={64} className="text-gray-300" />
                            <div className="absolute top-0 right-0 bg-red-100 p-2 rounded-full">
                                <X size={20} className="text-red-500" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">No matches found</h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-8">
                            We couldn't find any products matching your filters. Try checking spelling or use broader keywords.
                        </p>
                        <button
                            onClick={() => {setSearchTerm(''); setSelectedCategory('All');}}
                            className="px-8 py-3 bg-gray-900 text-white rounded-xl hover:bg-black hover:shadow-lg transition-all font-bold flex items-center gap-2"
                        >
                            <RefreshCw size={18} /> Reset Filters
                        </button>
                    </div>
                )}
            </div>

            {/* Footer Badge */}
            <div className="flex justify-center mt-12 mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-100">
                    <Zap size={14} fill="currentColor" /> Verified Authentic Equipment
                </span>
            </div>
        </div>
    );
}