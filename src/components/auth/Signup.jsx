import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';

export default function Signup() {
    const [formData, setFormData] = useState({ email: '', password: '', full_name: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/signup', formData);
            alert('Account created! Please login.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[500px]">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-green-600">Sign Up</h2>
                {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={formData.full_name}
                            onChange={(e) => setFormData({...formData, full_name: e.target.value})} required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})} required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})} required
                        />
                    </div>
                    <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition">
                        Create Account
                    </button>
                </form>
                <div className="mt-4 text-center text-sm">
                    Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Log in</Link>
                </div>
            </div>
        </div>
    );
}