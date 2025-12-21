import React, { useState, useEffect } from 'react';
import {Routes, Route, useNavigate, Navigate, useLocation} from 'react-router-dom';

// Import API
import api from './api';

// Import Components
import Header from './components/layout/Header';
import ShopView from './components/shop/ShopView';
import CartView from './components/cart/CartView';
import CheckoutForm from './components/cart/CheckoutForm';
import UserProfile from './components/auth/UserProfile';
import ProductDetail from './components/shop/ProductDetail';
import MyOrders from './components/user/MyOrders';

// Import Admin Components
import CategoryList from './admin/categories/CategoryList';
import ProviderList from './admin/providers/ProviderList.jsx';
import EquipmentManager from './admin/equipment/EquipmentManager';
import CategoryManager from './admin/categories/CategoryManager.jsx';
import UserManager from './admin/users/UserManager';
import OrderManager from './admin/orders/OrderManager';
import ProviderManager from "./admin/providers/ProviderManager.jsx";

// Import Auth Components
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';

import './App.css';

export default function App() {
    const navigate = useNavigate();
    const location = useLocation(); // Hook lấy đường dẫn hiện tại

    // --- STATE ---
    const [categories, setCategories] = useState([]);
    const [providers, setProviders] = useState([]);
    const [equipment, setEquipment] = useState([]);

    // 1. THÊM STATE LOADING (Mặc định là true để hiện loading ngay khi vào)
    const [loading, setLoading] = useState(true);

    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);

    // AUTH STATE
    const [user, setUser] = useState(null);

    // --- EFFECT 1: Kiểm tra đăng nhập ---
    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (token && role) {
            setUser({ token, role });
        }
    }, []);

    // --- EFFECT 2: Lấy dữ liệu từ Database ---
    // (Lưu ý: ShopView mới cũng sẽ tự gọi lại hàm này khi mount để đảm bảo data mới nhất)
    useEffect(() => {
        fetchData();
    }, []);

    // 2. CẬP NHẬT FETCH DATA (Xử lý Loading)
    const fetchData = async () => {
        setLoading(true); // Bắt đầu tải
        try {
            const [catRes, provRes, equipRes] = await Promise.all([
                api.get('/categories'),
                api.get('/providers'),
                api.get('/equipments')
            ]);

            setCategories(catRes.data);
            setProviders(provRes.data);

            const formattedEquip = equipRes.data.map(item => ({
                ...item,
                categoryId: item.category_id,
                providerId: item.provider_id,
                image: item.image || 'https://placehold.co/400x300?text=No+Image'
            }));

            setEquipment(formattedEquip);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu:", error);
        } finally {
            setLoading(false); // Kết thúc tải (dù thành công hay thất bại)
        }
    };

    // --- AUTH ACTIONS ---
    const handleLoginSuccess = (userData) => {
        localStorage.setItem('token', userData.token);
        localStorage.setItem('role', userData.role);
        setUser({ token: userData.token, role: userData.role });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setUser(null);
        navigate('/login');
    };

    // --- LOGIC GIỎ HÀNG ---
    const addToCart = (product) => {
        setCart(prevCart => {
            const existing = prevCart.find(c => c.id === product.id);
            if (existing) {
                if (existing.quantity >= product.stock) return prevCart;
                return prevCart.map(c => c.id === product.id ? { ...c, quantity: c.quantity + 1 } : c);
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(c => c.id !== id));
    };

    const updateCartQty = (id, qty) => {
        if (qty <= 0) {
            removeFromCart(id);
            return;
        }
        const itemInCart = cart.find(c => c.id === id);
        if (itemInCart && qty > itemInCart.stock) return;
        setCart(cart.map(c => c.id === id ? { ...c, quantity: qty } : c));
    };

    const startCheckout = () => {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }
        if (!user) {
            alert("Please login to checkout!");
            navigate('/login');
            return;
        }
        navigate('/checkout');
    };

    const handlePaymentSuccess = async (customerInfo) => {
        try {
            const totalMoney = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            await api.post('/orders', {
                full_name: customerInfo.name,
                phone: customerInfo.phone,
                address: customerInfo.address,
                payment_method: customerInfo.payment_method,
                items: cart,
                total_money: totalMoney
            });
            alert(`Order placed successfully!`);
            setCart([]);
            setOrders([]);
            navigate('/my-orders');
        } catch (error) {
            console.error("Payment error:", error);
            alert("Failed to place order.");
        }
    };

    // --- CHECK AUTH PAGE ---
    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

    // --- RENDER ---
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">

            {/* 3. ẨN HEADER Ở TRANG LOGIN/SIGNUP ĐỂ FULL MÀN HÌNH */}
            {!isAuthPage && (
                <Header cartCount={cart.length} user={user} onLogout={handleLogout} />
            )}

            <main className={isAuthPage ? "w-full min-h-screen p-0" : "container mx-auto p-6 flex-grow"}>
                <Routes>
                    {/* --- Shop & Product --- */}
                    <Route
                        path="/"
                        element={
                            <ShopView
                                equipment={equipment}
                                categories={categories}
                                cart={cart}
                                onAddToCart={addToCart}
                                // 4. TRUYỀN PROPS MỚI CHO SHOPVIEW
                                isLoading={loading}      // Trạng thái đang tải
                                onRefresh={fetchData}    // Hàm để ShopView tự gọi lại khi cần
                            />
                        }
                    />
                    <Route path="/product/:id" element={<ProductDetail onAddToCart={addToCart} cart={cart} />} />

                    {/* --- Auth (Login / Signup) --- */}
                    <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* --- Cart & Checkout --- */}
                    <Route
                        path="/cart"
                        element={
                            <CartView
                                cart={cart}
                                onUpdateQty={updateCartQty}
                                onRemove={removeFromCart}
                                onCheckout={startCheckout}
                                onContinueShopping={() => navigate('/')}
                            />
                        }
                    />
                    <Route
                        path="/checkout"
                        element={
                            <CheckoutForm
                                cart={cart}
                                onConfirm={handlePaymentSuccess}
                                onCancel={() => navigate('/cart')}
                            />
                        }
                    />

                    {/* --- User Routes --- */}
                    {user ? (
                        <>
                            <Route path="/profile" element={<UserProfile user={user} />} />
                            <Route path="/my-orders" element={<MyOrders />} />
                        </>
                    ) : (
                        <Route path="/profile" element={<div className="text-center mt-10">Please Login first</div>} />
                    )}

                    {/* --- Admin Routes --- */}
                    {user?.role === 'admin' ? (
                        <>
                            <Route path="admin/categories" element={<CategoryManager />} />
                            <Route path="/admin/equipment" element={<EquipmentManager />} />
                            <Route path="/admin/providers" element={<ProviderManager />} />
                            <Route path="/admin/users" element={<UserManager />} />
                            <Route path="/admin/orders" element={<OrderManager />} />
                        </>
                    ) : (
                        <Route path="/admin/*" element={<div className="text-center mt-10 text-red-500">Access Denied: Admin only</div>} />
                    )}
                </Routes>
            </main>
        </div>
    );
}