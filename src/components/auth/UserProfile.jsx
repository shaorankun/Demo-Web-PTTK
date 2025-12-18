import React, { useState, useEffect } from 'react';
import api from '../../api';

export default function UserProfile({ user }) {
    const [formData, setFormData] = useState({
        full_name: '', // Key state là full_name
        email: '',
        phone: '',
        address: ''
    });
    const [loading, setLoading] = useState(true);

    // Lấy thông tin cá nhân khi vào trang
    useEffect(() => {
        fetchMyProfile();
    }, []);

    const fetchMyProfile = async () => {
        try {
            const res = await api.get('/users/profile');
            setFormData({
                // Đảm bảo map đúng field từ backend trả về
                full_name: res.data.full_name || '',
                email: res.data.email || '',
                phone: res.data.phone || '',
                address: res.data.address || ''
            });
        } catch (error) {
            console.error("Error loading profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        // e.target.name sẽ là 'full_name' nên nó update đúng vào state
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put('/users/profile', formData);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Update error:", error);
            alert("Failed to update profile.");
        }
    };

    if (loading) return <div className="text-center mt-10">Loading profile...</div>;

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">My Profile</h2>

            <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                    <input
                        type="text"
                        // --- SỬA Ở ĐÂY ---
                        name="full_name"
                        value={formData.full_name}
                        // ----------------
                        onChange={handleChange}
                        className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled
                        className="w-full p-3 border rounded bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                    <small className="text-gray-500">Contact admin to change email.</small>
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-2">Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-2">Address</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition duration-300"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
}