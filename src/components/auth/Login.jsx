import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Zap, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import api from '../../api';

export default function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await api.post('/auth/login', { email, password });

            // Delay giả lập để trải nghiệm mượt mà
            setTimeout(() => {
                onLoginSuccess(res.data);
                navigate('/');
            }, 500);

        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-white animate-fade-in overflow-hidden">

            {/* --- CỘT TRÁI: BRANDING & WELCOME (Ẩn trên mobile) --- */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-blue-900 text-white justify-center items-center overflow-hidden">

                {/* Hình nền sang trọng */}
                <img
                    src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                    alt="Office"
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                />

                {/* Lớp phủ Gradient Xanh Dương */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-indigo-900/50 to-blue-900/30"></div>

                {/* Nội dung Branding */}
                <div className="relative z-10 p-12 max-w-lg">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl border border-white/20">
                            <Zap className="text-yellow-400 fill-yellow-400" size={32} />
                        </div>
                        <span className="text-2xl font-bold tracking-wide">ElectroShop</span>
                    </div>

                    <h1 className="text-5xl font-extrabold mb-6 leading-tight">
                        Welcome Back to <br/>
                        <span className="text-blue-300">Excellence.</span>
                    </h1>
                    <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                        Sign in to access your personalized dashboard, track your orders, and explore the latest tech trends.
                    </p>

                    {/* Trust Badge nhỏ */}
                    <div className="flex items-center gap-4 bg-blue-950/40 backdrop-blur-sm p-4 rounded-2xl border border-blue-400/20">
                        <ShieldCheck className="text-green-400" size={32} />
                        <div>
                            <p className="font-bold text-white">100% Secure</p>
                            <p className="text-xs text-blue-200">Encrypted transaction & data protection.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- CỘT PHẢI: FORM ĐĂNG NHẬP --- */}
            <div className="w-full lg:w-1/2 flex justify-center items-center p-8 lg:p-12 relative bg-white">

                {/* Decor Blob Background */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                <div className="w-full max-w-md relative z-10">
                    <div className="text-center mb-10">
                        <div className="inline-block p-3 rounded-2xl bg-blue-50 text-blue-600 mb-4 lg:hidden">
                            <Zap size={32} fill="currentColor" />
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">Login Account</h2>
                        <p className="text-gray-500">Please enter your details to sign in.</p>
                    </div>

                    {/* Thông báo lỗi */}
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium flex items-center gap-2 animate-pulse border border-red-100">
                            <AlertCircle size={20} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* EMAIL INPUT */}
                        <div>
                            <label className="text-sm font-bold text-gray-700 mb-1 block uppercase tracking-wide">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* PASSWORD INPUT */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Password</label>
                                <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline">Forgot Password?</a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-xl shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-1 ${
                                loading
                                    ? 'bg-blue-300 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                            }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="animate-spin" /> Signing in...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    Sign In <ArrowRight size={20} />
                                </span>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-gray-600">
                            Don't have an account yet?{' '}
                            <Link to="/signup" className="font-bold text-blue-600 hover:text-indigo-700 transition-colors underline decoration-2 underline-offset-4">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}