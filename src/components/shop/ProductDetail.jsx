import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Package, AlertCircle, CheckCircle, X } from 'lucide-react'; // Import thêm icon thông báo
import api from '../../api';

// 1. NHẬN THÊM PROP 'cart'
export default function ProductDetail({ onAddToCart, cart = [] }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    // 2. State cho thông báo (Toast)
    const [toast, setToast] = useState(null);

    // Tự động tắt thông báo sau 3s
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                // Đảm bảo endpoint này đúng với backend của bạn (/equipments hoặc /products)
                const res = await api.get(`/equipments/${id}`);
                setProduct(res.data);
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    // 3. HÀM XỬ LÝ ADD TO CART VỚI CHECK STOCK
    const handleAddToCart = () => {
        if (!product) return;

        // Tìm xem trong giỏ đã có món này chưa
        // Lưu ý: So sánh id (có thể cần ép kiểu string/number tùy DB)
        const existingItem = cart.find(item => item.id === product.id);
        const currentQtyInCart = existingItem ? existingItem.quantity : 0;

        // KIỂM TRA: Nếu thêm 1 cái nữa mà vượt quá stock -> Báo lỗi
        if (currentQtyInCart + 1 > product.stock) {
            setToast({
                type: 'error',
                message: `Cannot add more! Only ${product.stock} items available.`
            });
            return;
        }

        // Nếu hợp lệ -> Gọi hàm gốc
        onAddToCart(product);

        // Báo thành công
        setToast({
            type: 'success',
            message: 'Added to cart successfully!'
        });
    };

    if (loading) return <div className="text-center mt-10">Loading product details...</div>;

    if (!product) return (
        <div className="text-center mt-10">
            <h2 className="text-2xl font-bold text-red-500">Product Not Found</h2>
            <Link to="/" className="text-blue-600 underline mt-4 block">Go back home</Link>
        </div>
    );

    return (
        <div className="container mx-auto p-6 relative">

            {/* --- PHẦN THÔNG BÁO (TOAST) --- */}
            {toast && (
                <div className={`fixed top-24 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded shadow-lg animate-bounce-in border-l-4 ${
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

            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition"
            >
                <ArrowLeft size={20} /> Back to Shop
            </button>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* CỘT TRÁI: ẢNH */}
                    <div className="bg-gray-100 h-96 flex items-center justify-center p-8 relative">
                        {product.image && product.image !== 'https://placehold.co/400x300?text=No+Image' ? (
                            <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
                        ) : (
                            <Package size={120} className="text-gray-400" />
                        )}

                        {/* Overlay nếu hết hàng */}
                        {product.stock <= 0 && (
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                <span className="text-white font-bold text-3xl border-4 border-white px-6 py-2 transform -rotate-12">
                                    SOLD OUT
                                </span>
                            </div>
                        )}
                    </div>

                    {/* CỘT PHẢI: THÔNG TIN */}
                    <div className="p-8 flex flex-col justify-center">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>

                        <div className="text-3xl font-bold text-blue-600 mb-6">
                            ${product.price}
                        </div>

                        <div className="space-y-4 mb-8 text-gray-600">
                            <p className="border-b pb-2">
                                <span className="font-semibold text-gray-800">Description:</span> <br/>
                                {product.description || "No description available."}
                            </p>
                            <p>
                                <span className="font-semibold text-gray-800">Availability: </span>
                                <span className={product.stock > 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                                    {product.stock > 0 ? `${product.stock} units in stock` : "Out of Stock"}
                                </span>
                            </p>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock <= 0} // Disable nút nếu hết hàng
                            className={`py-4 px-8 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition transform shadow-md ${
                                product.stock > 0
                                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            <ShoppingCart size={24} />
                            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}