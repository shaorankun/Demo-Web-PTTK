import React from 'react';
import { ShoppingCart, User, LogOut, LogIn } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

export default function Header({ cartCount, user, onLogout }) {

    const getLinkClass = ({ isActive }) =>
        isActive ? "underline font-bold" : "hover:underline opacity-90";

    return (
        <header className="bg-blue-600 text-white p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo bấm vào sẽ về trang chủ */}
                <Link to="/" className="text-2xl font-bold hover:opacity-90">
                    ElectroShop
                </Link>

                <nav className="flex gap-6 items-center">
                    {/* --- SHOP (Ai cũng thấy) --- */}
                    <NavLink to="/" className={getLinkClass}>
                        Shop
                    </NavLink>

                    {/* --- USER LINKS (Chỉ hiện khi đã đăng nhập) --- */}
                    {/* Link xem lịch sử đơn hàng của chính mình */}
                    {user && (
                        <NavLink to="/my-orders" className={getLinkClass}>
                            My Orders
                        </NavLink>
                    )}

                    {/* --- ADMIN LINKS (Chỉ hiện nếu user là admin) --- */}
                    {user?.role === 'admin' && (
                        <>
                            <div className="h-6 w-px bg-blue-400 mx-2"></div> {/* Đường kẻ ngăn cách */}

                            {/* Quản lý đơn hàng toàn hệ thống */}
                            <NavLink to="/admin/orders" className={getLinkClass}>
                                Manage Orders
                            </NavLink>

                            <NavLink to="/admin/categories" className={getLinkClass}>
                                Categories
                            </NavLink>

                            <NavLink to="/admin/equipment" className={getLinkClass}>
                                Equipment
                            </NavLink>

                            <NavLink to="/admin/providers" className={getLinkClass}>
                                Providers
                            </NavLink>

                            <NavLink to="/admin/users" className={getLinkClass}>
                                Users
                            </NavLink>
                        </>
                    )}

                    {/* --- CART (Luôn hiện) --- */}
                    <Link to="/cart" className="relative p-1 hover:bg-blue-700 rounded transition ml-4">
                        <ShoppingCart size={24} />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center border-2 border-blue-600">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* --- AUTH SECTION (Login / Logout) --- */}
                    <div className="border-l border-blue-400 pl-6 flex items-center gap-4">
                        {user ? (
                            // TRƯỜNG HỢP ĐÃ ĐĂNG NHẬP
                            <>
                                <Link
                                    to="/profile"
                                    className="flex items-center gap-2 hover:bg-blue-700 p-2 rounded transition"
                                    title="Go to Profile"
                                >
                                    <User size={20} />
                                    <span className="font-medium capitalize hidden md:block">
                                        {user.role}
                                    </span>
                                </Link>

                                <button
                                    onClick={onLogout}
                                    className="flex items-center gap-1 hover:text-red-200 transition ml-2"
                                    title="Logout"
                                >
                                    <LogOut size={20} />
                                </button>
                            </>
                        ) : (
                            // TRƯỜNG HỢP CHƯA ĐĂNG NHẬP
                            <Link
                                to="/login"
                                className="flex items-center gap-1 hover:underline font-medium bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100 transition"
                            >
                                <LogIn size={18} />
                                <span>Login</span>
                            </Link>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
}