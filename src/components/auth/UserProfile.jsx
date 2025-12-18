import React, { useState, useEffect } from 'react';
import api from '../../api'; // Ensure this path is correct

export default function UserProfile() {
    // State initialization
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' }); // For notification messages

    // 1. Fetch user profile on component mount
    useEffect(() => {
        fetchMyProfile();
    }, []);

    const fetchMyProfile = async () => {
        try {
            const res = await api.get('/users/profile');
            setFormData({
                // Mapping backend fields to state
                // Using || '' to handle null values from database
                full_name: res.data.full_name || '',
                email: res.data.email || '',
                phone: res.data.phone || '',
                address: res.data.address || ''
            });
        } catch (error) {
            console.error("Error loading profile:", error);
            setMessage({ type: 'error', text: 'Failed to load user profile.' });
        } finally {
            setLoading(false);
        }
    };

    // 2. Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 3. Submit updates to Server
    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' }); // Reset message

        try {
            // Sends: full_name, phone, address
            await api.put('/users/profile', formData);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            console.error("Update error:", error);
            setMessage({ type: 'error', text: 'Update failed. Please try again.' });
        }
    };

    if (loading) return <div className="text-center mt-10 text-gray-600">Loading profile...</div>;

    return (
        <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">My Profile</h2>

            {/* Notification Message */}
            {message.text && (
                <div className={`p-4 mb-6 rounded-lg text-center ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-6">
                {/* Full Name */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                    <input
                        type="text"
                        name="full_name" // MUST match backend key
                        value={formData.full_name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        required
                    />
                </div>

                {/* Email (Read Only) */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full p-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
                    <input
                        type="tel"
                        name="phone" // MUST match backend key
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                </div>

                {/* Address */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Address</label>
                    <textarea
                        name="address" // MUST match backend key
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Enter your address..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                    ></textarea>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
}