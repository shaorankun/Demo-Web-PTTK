import React from 'react';
import { ShoppingCart, User, LogOut, LogIn, Zap, LayoutDashboard, Package, Users, Truck, List } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

export default function Header({ cartCount, user, onLogout }) {

    // Style cho Link: Dạng viên thuốc (Pill), Active thì nền trắng chữ xanh
    const getLinkClass = ({ isActive }) =>
        `flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            isActive
                ? "bg-white text-blue-700 shadow-md transform scale-105"
                : "text-blue-50 hover:bg-white/10 hover:text-white"
        }`;

    return (
        // STICKY HEADER: Dính lên trên cùng, Gradient xanh, đổ bóng
        <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-white shadow-lg backdrop-blur-sm bg-opacity-95 animate-fade-in">
            <div className="w-full px-6 py-3 flex justify-between items-center max-w-[1920px] mx-auto">

                {/* --- LOGO --- */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-white text-blue-600 p-1.5 rounded-lg shadow-lg group-hover:rotate-12 transition-transform duration-300">
                        <Zap size={24} fill="currentColor" />
                    </div>
                    <span className="text-2xl font-extrabold tracking-tight group-hover:opacity-90">
                        ElectroShop
                    </span>
                </Link>

                <nav className="flex items-center gap-2">
                    {/* --- SHOP LINK --- */}
                    <NavLink to="/" className={getLinkClass}>
                        Shop
                    </NavLink>

                    {/* --- USER ORDERS --- */}
                    {user && (
                        <NavLink to="/my-orders" className={getLinkClass}>
                            My Orders
                        </NavLink>
                    )}

                    {/* --- ADMIN LINKS SECTION --- */}
                    {user?.role === 'admin' && (
                        <div className="hidden xl:flex items-center bg-blue-800/30 rounded-full px-2 py-1 ml-4 border border-blue-500/30">
                            {/* Manage Orders */}
                            <NavLink to="/admin/orders" className={getLinkClass}>
                                <LayoutDashboard size={16} /> Orders
                            </NavLink>

                            {/* Categories */}
                            <NavLink to="/admin/categories" className={getLinkClass}>
                                <List size={16} /> Cats
                            </NavLink>

                            {/* Products */}
                            <NavLink to="/admin/equipment" className={getLinkClass}>
                                <Package size={16} /> Prods
                            </NavLink>

                            {/* Providers */}
                            <NavLink to="/admin/providers" className={getLinkClass}>
                                <Truck size={16} /> Provs
                            </NavLink>

                            {/* Users */}
                            <NavLink to="/admin/users" className={getLinkClass}>
                                <Users size={16} /> Users
                            </NavLink>
                        </div>
                    )}

                    {/* --- RIGHT SECTION: CART & AUTH --- */}
                    <div className="flex items-center gap-4 ml-6 pl-6 border-l border-blue-400/50">

                        {/* CART ICON */}
                        <Link to="/cart" className="relative group p-2 hover:bg-white/10 rounded-full transition-colors">
                            <ShoppingCart size={24} className="group-hover:scale-110 transition-transform" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-blue-600 shadow-sm animate-bounce">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* AUTHENTICATION */}
                        {user ? (
                            // ĐÃ ĐĂNG NHẬP
                            <div className="flex items-center gap-3">
                                <Link
                                    to="/profile"
                                    className="flex items-center gap-2 bg-blue-800/40 hover:bg-blue-800/60 border border-blue-500/30 pl-2 pr-4 py-1.5 rounded-full transition-all group"
                                    title="Go to Profile"
                                >
                                    <div className="bg-white/10 p-1 rounded-full group-hover:bg-white/20">
                                        <User size={18} />
                                    </div>
                                    <div className="flex flex-col leading-none">
                                        <span className="text-xs text-blue-200 font-medium">Hello,</span>
                                        <span className="text-sm font-bold capitalize">{user.role}</span>
                                    </div>
                                </Link>

                                <button
                                    onClick={onLogout}
                                    className="p-2 text-blue-200 hover:text-red-300 hover:bg-red-500/10 rounded-full transition-all"
                                    title="Logout"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            // CHƯA ĐĂNG NHẬP
                            <Link
                                to="/login"
                                className="flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 px-5 py-2 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                            >
                                <LogIn size={18} />
                                Login
                            </Link>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
}