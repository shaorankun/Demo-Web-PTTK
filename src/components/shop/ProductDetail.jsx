import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Package } from 'lucide-react';
import api from '../../api';

export default function ProductDetail({ onAddToCart }) {
    const { id } = useParams(); // Lấy ID từ URL (ví dụ: /product/5 -> id = 5)
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
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

    if (loading) return <div className="text-center mt-10">Loading product details...</div>;

    if (!product) return (
        <div className="text-center mt-10">
            <h2 className="text-2xl font-bold text-red-500">Product Not Found</h2>
            <Link to="/" className="text-blue-600 underline mt-4 block">Go back home</Link>
        </div>
    );

    return (
        <div className="container mx-auto p-6">
            {/* Nút Quay lại */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition"
            >
                <ArrowLeft size={20} /> Back to Shop
            </button>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* CỘT TRÁI: ẢNH */}
                    <div className="bg-gray-100 h-96 flex items-center justify-center p-8">
                        {/* Nếu có ảnh thật thì hiện ảnh thật, không thì hiện icon */}
                        {product.image && product.image !== 'https://placehold.co/400x300?text=No+Image' ? (
                            <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
                        ) : (
                            <Package size={120} className="text-gray-400" />
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
                                <span className="font-semibold text-gray-800">Stock:</span> {product.stock} units available
                            </p>
                            {/* Bạn có thể fetch thêm tên Category/Provider nếu muốn hiển thị chi tiết hơn */}
                        </div>

                        <button
                            onClick={() => onAddToCart(product)}
                            className="bg-blue-600 text-white py-4 px-8 rounded-lg hover:bg-blue-700 font-bold text-lg flex items-center justify-center gap-2 transition transform hover:scale-105 shadow-md"
                        >
                            <ShoppingCart size={24} />
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}