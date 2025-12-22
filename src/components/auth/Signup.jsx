import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// 1. SỬA LỖI: Thêm AlertCircle vào import
import { User, Mail, Lock, ArrowRight, Loader2, Star, AlertCircle } from 'lucide-react';
import api from '../../api';

export default function Signup() {
    const [formData, setFormData] = useState({ email: '', password: '', full_name: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/auth/signup', formData);
            // Delay nhẹ để user thấy loading xong
            setTimeout(() => {
                alert('Account created successfully! Please login.');
                navigate('/login');
            }, 500);
        } catch (err) {
            // Lấy message lỗi từ backend trả về
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-white animate-fade-in overflow-hidden">

            {/* --- CỘT TRÁI: BRANDING --- */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 text-white justify-center items-center overflow-hidden">

                {/* 2. THÊM ẢNH NỀN CHO ĐẸP (Thay vì để trống) */}
                <img
                    src="https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                    alt="Shopping"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />

                {/* Gradient phủ */}
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/90 via-green-900/50 to-transparent"></div>

                <div className="relative z-10 p-12 max-w-lg">
                    <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl w-fit mb-6 border border-white/20">
                        <Star className="text-yellow-400 fill-yellow-400" size={32} />
                    </div>
                    <h1 className="text-5xl font-extrabold mb-6 leading-tight">
                        Join the Future of <br/><span className="text-green-400">Shopping.</span>
                    </h1>
                    <p className="text-lg text-gray-200 mb-8 leading-relaxed">
                        Create an account to unlock exclusive deals, track your orders in real-time, and experience the best customer service.
                    </p>

                    <div className="flex items-center gap-4 bg-black/30 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                        <div className="flex -space-x-3">
                            <img className="w-10 h-10 rounded-full border-2 border-green-500" src="https://i.pravatar.cc/100?img=5" alt="User" />
                            <img className="w-10 h-10 rounded-full border-2 border-green-500" src="https://i.pravatar.cc/100?img=9" alt="User" />
                            <img className="w-10 h-10 rounded-full border-2 border-green-500" src="https://i.pravatar.cc/100?img=12" alt="User" />
                        </div>
                        <div className="text-sm font-medium">
                            <span className="text-white font-bold text-lg">5k+</span> <br/> happy customers joined!
                        </div>
                    </div>
                </div>
            </div>

            {/* --- CỘT PHẢI: FORM --- */}
            <div className="w-full lg:w-1/2 flex justify-center items-center p-8 lg:p-12 relative">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                <div className="w-full max-w-md relative z-10">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h2>
                        <p className="text-gray-500">Enter your details below to get started.</p>
                    </div>

                    {/* HIỂN THỊ LỖI (Giờ đã hoạt động vì đã import AlertCircle) */}
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium flex items-center gap-2 animate-pulse border border-red-100">
                            <AlertCircle size={20} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* FULL NAME */}
                        <div>
                            <label className="text-sm font-bold text-gray-700 mb-1 block uppercase tracking-wide">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-4 focus:ring-green-100 focus:border-green-500 outline-none transition-all font-medium"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        {/* EMAIL */}
                        <div>
                            <label className="text-sm font-bold text-gray-700 mb-1 block uppercase tracking-wide">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    placeholder="you@company.com"
                                    className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-4 focus:ring-green-100 focus:border-green-500 outline-none transition-all font-medium"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <label className="text-sm font-bold text-gray-700 mb-1 block uppercase tracking-wide">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-4 focus:ring-green-100 focus:border-green-500 outline-none transition-all font-medium"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-xl shadow-green-500/20 transition-all duration-300 transform hover:-translate-y-1 ${
                                loading
                                    ? 'bg-green-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700'
                            }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="animate-spin" /> Creating...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    Create Account <ArrowRight size={20} />
                                </span>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-bold text-green-600 hover:text-green-800 transition-colors underline decoration-2 underline-offset-4">
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}