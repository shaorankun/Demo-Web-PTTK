import React, {useState, useEffect} from 'react';
import {Routes, Route, useNavigate, Navigate} from 'react-router-dom';

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

// --- THAY ĐỔI QUAN TRỌNG: Import Manager thay vì List ---
// File này nằm ở ./admin/equipment/EquipmentManager.jsx như bạn đã tạo
import EquipmentManager from './admin/equipment/EquipmentManager';
import CategoryManager from './admin/categories/CategoryManager.jsx';
import UserManager from './admin/users/UserManager';
import OrderManager from './admin/orders/OrderManager';

// Import Auth Components
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';

import './App.css';
import ProviderManager from "./admin/providers/ProviderManager.jsx";

export default function App() {
    const navigate = useNavigate();

    // --- STATE ---
    const [categories, setCategories] = useState([]);
    const [providers, setProviders] = useState([]);
    const [equipment, setEquipment] = useState([]); // State này vẫn giữ để hiển thị cho ShopView (Trang chủ)

    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);

    // AUTH STATE
    const [user, setUser] = useState(null);

    // State cho Admin Form (Categories & Providers vẫn dùng cái này)
    const [editItem, setEditItem] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // --- EFFECT 1: Kiểm tra đăng nhập ---
    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (token && role) {
            setUser({token, role});
        }
    }, []);

    // --- EFFECT 2: Lấy dữ liệu từ Database ---
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
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
        }
    };

    // --- AUTH ACTIONS ---
    const handleLoginSuccess = (userData) => {
        localStorage.setItem('token', userData.token);
        localStorage.setItem('role', userData.role);
        setUser({token: userData.token, role: userData.role});
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setUser(null);
        navigate('/login');
    };

    // --- LOGIC GIỎ HÀNG ---
    const addToCart = (item) => {
        const existing = cart.find(c => c.id === item.id);
        if (existing) {
            setCart(cart.map(c => c.id === item.id ? {...c, quantity: c.quantity + 1} : c));
        } else {
            setCart([...cart, {...item, quantity: 1}]);
        }
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(c => c.id !== id));
    };

    const updateCartQty = (id, qty) => {
        if (qty <= 0) {
            removeFromCart(id);
        } else {
            setCart(cart.map(c => c.id === id ? {...c, quantity: qty} : c));
        }
    };

    // --- LOGIC THANH TOÁN ---
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
            // Tính tổng tiền
            const totalMoney = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            // GỌI API TẠO ĐƠN HÀNG THẬT
            await api.post('/orders', {
                full_name: customerInfo.name,
                phone: customerInfo.phone,
                address: customerInfo.address,
                items: cart, // Gửi danh sách hàng
                total_money: totalMoney
            });

            alert(`Order placed successfully!`);
            setCart([]); // Xóa giỏ hàng
            setOrders([]); // (Optional: nếu bạn muốn clear state cũ)
            navigate('/my-orders'); // Chuyển hướng về trang lịch sử đơn hàng

        } catch (error) {
            console.error("Payment error:", error);
            alert("Failed to place order.");
        }
    };

    // --- LOGIC ADMIN (Categories & Providers - Giữ nguyên logic cũ) ---
    // (Lưu ý: Logic này đang chạy local state, bạn nên nâng cấp thành API sau này giống EquipmentManager)
    const addCategory = (cat) => {
        setCategories([...categories, {...cat, id: Date.now()}]);
        setShowForm(false);
    };
    const updateCategory = (id, cat) => {
        setCategories(categories.map(c => c.id === id ? {...cat, id} : c));
        setEditItem(null);
        setShowForm(false);
    };
    const deleteCategory = (id) => {
        if (window.confirm('Delete?')) setCategories(categories.filter(c => c.id !== id));
    };
    const handleCategorySave = (data) => {
        editItem ? updateCategory(editItem.id, data) : addCategory(data);
    };

    const addProvider = (prov) => {
        setProviders([...providers, {...prov, id: Date.now()}]);
        setShowForm(false);
    };
    const updateProvider = (id, prov) => {
        setProviders(providers.map(p => p.id === id ? {...prov, id} : p));
        setEditItem(null);
        setShowForm(false);
    };
    const deleteProvider = (id) => {
        if (window.confirm('Delete?')) setProviders(providers.filter(p => p.id !== id));
    };
    const handleProviderSave = (data) => {
        editItem ? updateProvider(editItem.id, data) : addProvider(data);
    };

    // --- FORM HELPERS (Dùng cho Categories và Providers) ---
    const handleShowForm = () => {
        setShowForm(true);
        setEditItem(null);
    };
    const handleEdit = (item) => {
        setEditItem(item);
        setShowForm(true);
    };
    const handleCancelForm = () => {
        setShowForm(false);
        setEditItem(null);
    };

    // --- RENDER ---
    return (
        <div className="min-h-screen bg-gray-50">
            <Header cartCount={cart.length} user={user} onLogout={handleLogout}/>

            <main className="container mx-auto p-6">
                <Routes>
                    {/* Trang chủ vẫn dùng state 'equipment' lấy ở App.js để hiển thị nhanh */}
                    <Route path="/"
                           element={<ShopView equipment={equipment} categories={categories} onAddToCart={addToCart}/>}/>
                    <Route path="/product/:id" element={<ProductDetail onAddToCart={addToCart}/>}/>

                    <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess}/>}/>
                    <Route path="/signup" element={<Signup/>}/>
                    <Route path="/cart"
                           element={<CartView cart={cart} onUpdateQty={updateCartQty} onRemove={removeFromCart}
                                              onCheckout={startCheckout} onContinueShopping={() => navigate('/')}/>}/>
                    <Route path="/checkout" element={<CheckoutForm cart={cart} onConfirm={handlePaymentSuccess}
                                                                   onCancel={() => navigate('/cart')}/>}/>

                    {user ? (
                        <>
                            <Route path="/profile" element={<UserProfile user={user}/>}/>
                            <Route path="/my-orders" element={user ? <MyOrders/> : <Navigate to="/login"/>}/>
                        </>
                    ) : (
                        // Nếu chưa login mà vào /profile thì đẩy về login
                        <Route path="/profile" element={<div className="text-center mt-10">Please Login first</div>}/>
                    )}

                    {user?.role === 'admin' ? (
                        <>
                            <Route path="admin/categories" element={<CategoryManager/>}/>

                            <Route path="/admin/equipment" element={<EquipmentManager/>}/>

                            <Route path="/admin/providers" element={<ProviderManager/>}/>

                            <Route path="/admin/users" element={<UserManager/>}/>

                            <Route path="/admin/orders" element={<OrderManager/>}/>
                        </>
                    ) : (
                        <Route path="/admin/*"
                               element={<div className="text-center mt-10 text-red-500">Access Denied: Admin
                                   only</div>}/>

                    )}
                </Routes>
            </main>
        </div>
    );
}