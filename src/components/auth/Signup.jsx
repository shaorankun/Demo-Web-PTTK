import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Loader2, CheckCircle, Star } from 'lucide-react';
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
            setTimeout(() => {
                alert('Account created successfully! Please login.');
                navigate('/login');
            }, 500);
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        // LAYOUT: Dùng flex h-screen để full màn hình
        <div className="flex min-h-screen bg-white animate-fade-in overflow-hidden">

            {/* --- CỘT TRÁI: HÌNH ẢNH BRANDING (Ẩn trên mobile, hiện trên LG) --- */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 text-white justify-center items-center overflow-hidden">
                {/* Hình nền Full chiều cao */}

                {/* Lớp phủ Gradient để chữ dễ đọc */}
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/90 via-green-900/40 to-transparent"></div>

                {/* Nội dung Branding */}
                <div className="relative z-10 p-12 max-w-lg">
                    <div className="bg-white/20 backdrop-blur-md p-2 rounded-lg w-fit mb-6">
                        <Star className="text-yellow-400 fill-yellow-400" size={32} />
                    </div>
                    <h1 className="text-5xl font-extrabold mb-6 leading-tight">
                        Join the Future of <span className="text-green-400">Shopping.</span>
                    </h1>
                    <p className="text-lg text-gray-200 mb-8 leading-relaxed">
                        Create an account to unlock exclusive deals, track your orders in real-time, and experience the best customer service.
                    </p>

                    {/* Testimonial nhỏ */}
                    <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                        <div className="flex -space-x-2">
                            <img className="w-10 h-10 rounded-full border-2 border-green-900" src="https://i.pravatar.cc/100?img=1" alt="User" />
                            <img className="w-10 h-10 rounded-full border-2 border-green-900" src="https://i.pravatar.cc/100?img=2" alt="User" />
                            <img className="w-10 h-10 rounded-full border-2 border-green-900" src="https://i.pravatar.cc/100?img=3" alt="User" />
                        </div>
                        <div className="text-sm font-medium">
                            <span className="text-white font-bold">5k+</span> happy customers joined this week!
                        </div>
                    </div>
                </div>
            </div>

            {/* --- CỘT PHẢI: FORM ĐĂNG KÝ --- */}
            <div className="w-full lg:w-1/2 flex justify-center items-center p-8 lg:p-12 relative">
                {/* Decor Blob Background bên phải */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                <div className="w-full max-w-md relative z-10">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h2>
                        <p className="text-gray-500">Enter your details below to get started.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium flex items-center gap-2 animate-pulse">
                            <AlertCircle size={20} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* FULL NAME */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-1 block">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 outline-none transition-all"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        {/* EMAIL */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-1 block">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    placeholder="you@company.com"
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 outline-none transition-all"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-1 block">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 outline-none transition-all"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    required
                                />
                            </div>
                            {/* Password Strength Hints (Optional UI) */}
                            <div className="flex gap-1 mt-2">
                                <div className="h-1 w-1/4 bg-green-500 rounded-full"></div>
                                <div className="h-1 w-1/4 bg-green-500 rounded-full"></div>
                                <div className="h-1 w-1/4 bg-gray-200 rounded-full"></div>
                                <div className="h-1 w-1/4 bg-gray-200 rounded-full"></div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                                loading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-green-600 to-teal-600 hover:shadow-green-500/30'
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
                            <Link to="/login" className="font-bold text-green-600 hover:text-green-700 hover:underline">
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}