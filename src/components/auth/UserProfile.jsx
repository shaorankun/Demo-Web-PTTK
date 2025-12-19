import React, { useState, useEffect } from 'react';
import { Trash2, Plus, MapPin, User, Phone, AlertTriangle } from 'lucide-react';
import api from '../../api'; // Đảm bảo axios instance đã config baseURL là domain/api

export default function UserProfile() {
    // --- STATE CHO MAIN PROFILE ---
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        address: ''
    });

    // --- STATE CHO SHIPPING PROFILES ---
    const [profiles, setProfiles] = useState([]);
    const [newProfile, setNewProfile] = useState({
        title: '',
        full_name: '',
        phone: '',
        address: ''
    });

    // --- STATE CHUNG ---
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        Promise.all([fetchMyProfile(), fetchShippingProfiles()])
            .finally(() => setLoading(false));
    }, []);

    // 1. GET /api/users/profile
    const fetchMyProfile = async () => {
        try {
            // Gọi đúng route GET trong userRoutes
            const res = await api.get('/users/profile');
            setFormData({
                full_name: res.data.full_name || '',
                email: res.data.email || '',
                phone: res.data.phone || '',
                address: res.data.address || ''
            });
        } catch (error) {
            console.error("Error loading main profile:", error);
        }
    };

    // 2. GET /api/profiles (Giả định bạn có file profileRoutes.js riêng như trong index.js)
    const fetchShippingProfiles = async () => {
        try {
            const res = await api.get('/profiles');
            setProfiles(res.data);
        } catch (error) {
            console.error("Error loading address book:", error);
        }
    };

    // 3. PUT /api/users/profile
    const handleMainChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdateMain = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        try {
            // Gọi đúng route PUT trong userRoutes
            await api.put('/users/profile', formData);
            setMessage({ type: 'success', text: 'Account info updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update account info.' });
        }
    };

    // 4. DELETE /api/users/profile (Chức năng xóa tài khoản)
    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm(
            "WARNING: Are you sure you want to delete your account?\n\nThis action cannot be undone. All your data will be permanently removed."
        );

        if (confirmDelete) {
            try {
                // Gọi vào route bạn VỪA THÊM ở Bước 1
                await api.delete('/users/profile');

                // Xử lý đăng xuất sau khi xóa
                localStorage.removeItem('token');
                alert("Your account has been deleted.");
                window.location.href = '/login';
            } catch (error) {
                console.error(error);
                alert("Failed to delete account. Please try again.");
            }
        }
    };

    // --- CÁC HÀM XỬ LÝ ĐỊA CHỈ PHỤ (GIỮ NGUYÊN) ---
    const handleNewProfileChange = (e) => {
        setNewProfile({ ...newProfile, [e.target.name]: e.target.value });
    };

    const handleAddProfile = async (e) => {
        e.preventDefault();
        try {
            await api.post('/profiles', newProfile);
            await fetchShippingProfiles();
            setNewProfile({ title: '', full_name: '', phone: '', address: '' });
            alert("New address added successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to add address.");
        }
    };

    const handleDeleteProfile = async (id) => {
        if (!window.confirm("Delete this address?")) return;
        try {
            await api.delete(`/profiles/${id}`);
            setProfiles(profiles.filter(p => p.id !== id));
        } catch (error) {
            console.error(error);
            alert("Failed to delete address.");
        }
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* CỘT TRÁI */}
            <div className="space-y-8">
                {/* Form Main Info */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Account Settings</h2>
                    {message.text && (
                        <div className={`p-3 mb-4 rounded text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {message.text}
                        </div>
                    )}
                    <form onSubmit={handleUpdateMain} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                            <input type="text" name="full_name" value={formData.full_name} onChange={handleMainChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Email</label>
                            <input type="email" value={formData.email} disabled className="w-full p-2 border rounded bg-gray-100 text-gray-500 cursor-not-allowed" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Phone</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleMainChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Address</label>
                            <textarea name="address" value={formData.address} onChange={handleMainChange} rows="2" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition">Update Info</button>
                    </form>
                </div>

                {/* DANGER ZONE */}
                <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                    <h3 className="text-red-700 font-bold flex items-center gap-2 mb-2"><AlertTriangle size={20} /> Danger Zone</h3>
                    <p className="text-sm text-red-600 mb-4">Once you delete your account, there is no going back.</p>
                    <button onClick={handleDeleteAccount} className="w-full border border-red-500 text-red-600 hover:bg-red-600 hover:text-white font-bold py-2 rounded transition">
                        Delete My Account
                    </button>
                </div>
            </div>

            {/* CỘT PHẢI (Address Book) */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-500">
                    <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2"><Plus className="text-green-600" /> Add Address</h3>
                    <form onSubmit={handleAddProfile} className="space-y-3">
                        <input placeholder="Label (Home, Office)" name="title" value={newProfile.title} onChange={handleNewProfileChange} className="w-full p-2 border rounded text-sm outline-none focus:border-green-500" required />
                        <div className="grid grid-cols-2 gap-2">
                            <input placeholder="Name" name="full_name" value={newProfile.full_name} onChange={handleNewProfileChange} className="w-full p-2 border rounded text-sm outline-none focus:border-green-500" required />
                            <input placeholder="Phone" name="phone" value={newProfile.phone} onChange={handleNewProfileChange} className="w-full p-2 border rounded text-sm outline-none focus:border-green-500" required />
                        </div>
                        <textarea placeholder="Address" name="address" value={newProfile.address} onChange={handleNewProfileChange} rows="2" className="w-full p-2 border rounded text-sm outline-none focus:border-green-500" required></textarea>
                        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded text-sm transition">Save Address</button>
                    </form>
                </div>

                <div>
                    <h3 className="text-xl font-bold mb-3 text-gray-700">Saved Addresses ({profiles.length})</h3>
                    <div className="space-y-3 max-h-[500px] overflow-y-auto">
                        {profiles.map(profile => (
                            <div key={profile.id} className="bg-white p-4 rounded-lg shadow border border-gray-200 relative group hover:border-blue-400 transition">
                                <div className="flex justify-between items-start">
                                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded uppercase">{profile.title}</span>
                                    <button onClick={() => handleDeleteProfile(profile.id)} className="text-gray-400 hover:text-red-600 p-1"><Trash2 size={18} /></button>
                                </div>
                                <div className="text-sm text-gray-600 space-y-1 mt-2">
                                    <p className="flex items-center gap-2 font-medium text-gray-800"><User size={14} /> {profile.full_name}</p>
                                    <p className="flex items-center gap-2"><Phone size={14} /> {profile.phone}</p>
                                    <p className="flex items-start gap-2"><MapPin size={14} className="mt-1 flex-shrink-0" /> {profile.address}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}