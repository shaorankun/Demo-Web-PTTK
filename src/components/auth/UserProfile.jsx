import React, { useState, useEffect } from 'react';
import {
    Trash2, Plus, MapPin, User, Phone, AlertTriangle,
    Mail, Save, Shield, Camera, Home, Briefcase
} from 'lucide-react';
import api from '../../api';

export default function UserProfile() {
    // --- STATE GIỮ NGUYÊN ---
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        address: ''
    });

    const [profiles, setProfiles] = useState([]);
    const [newProfile, setNewProfile] = useState({
        title: '',
        full_name: '',
        phone: '',
        address: ''
    });

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        Promise.all([fetchMyProfile(), fetchShippingProfiles()])
            .finally(() => setLoading(false));
    }, []);

    // --- LOGIC API GIỮ NGUYÊN ---
    const fetchMyProfile = async () => {
        try {
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

    const fetchShippingProfiles = async () => {
        try {
            const res = await api.get('/profiles');
            setProfiles(res.data);
        } catch (error) {
            console.error("Error loading address book:", error);
        }
    };

    // --- LOGIC HANDLE CHANGE (CÓ CHECK SỐ ĐIỆN THOẠI) ---
    const handleMainChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            if (value !== '' && !/^\d+$/.test(value)) {
                alert('Invalid format! Phone number must contain only digits (0-9).');
                return;
            }
        }
        setFormData({ ...formData, [name]: value });
    };

    const handleUpdateMain = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        try {
            await api.put('/users/profile', formData);
            setMessage({ type: 'success', text: 'Account info updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update account info.' });
        }
    };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm(
            "WARNING: Are you sure you want to delete your account?\n\nThis action cannot be undone."
        );
        if (confirmDelete) {
            try {
                await api.delete('/users/profile');
                localStorage.removeItem('token');
                alert("Your account has been deleted.");
                window.location.href = '/login';
            } catch (error) {
                alert("Failed to delete account.");
            }
        }
    };

    const handleNewProfileChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            if (value !== '' && !/^\d+$/.test(value)) {
                alert('Invalid format! Phone number must contain only digits (0-9).');
                return;
            }
        }
        setNewProfile({ ...newProfile, [name]: value });
    };

    const handleAddProfile = async (e) => {
        e.preventDefault();
        try {
            await api.post('/profiles', newProfile);
            await fetchShippingProfiles();
            setNewProfile({ title: '', full_name: '', phone: '', address: '' });
            alert("New address added successfully!");
        } catch (error) {
            alert("Failed to add address.");
        }
    };

    const handleDeleteProfile = async (id) => {
        if (!window.confirm("Delete this address?")) return;
        try {
            await api.delete(`/profiles/${id}`);
            setProfiles(profiles.filter(p => p.id !== id));
        } catch (error) {
            alert("Failed to delete address.");
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 animate-fade-in">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* --- CỘT TRÁI: PROFILE CARD (Chiếm 4/12 cột) --- */}
                <div className="lg:col-span-4 space-y-6">

                    {/* CARD THÔNG TIN CHÍNH */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 relative">
                        {/* Header Background */}
                        <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-400"></div>

                        {/* Avatar (Giả lập) */}
                        <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
                            <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg">
                                <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-gray-400 relative overflow-hidden group">
                                    <User size={40} />
                                    {/* Hover effect upload ảnh (UI only) */}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                                        <Camera size={20} className="text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-16 pb-6 px-6">
                            <h2 className="text-center text-2xl font-bold text-gray-800">{formData.full_name || 'User Name'}</h2>
                            <p className="text-center text-blue-600 text-sm font-medium mb-6">{formData.email}</p>

                            {/* Thông báo cập nhật */}
                            {message.text && (
                                <div className={`p-3 mb-6 rounded-lg text-sm flex items-center gap-2 ${
                                    message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                                }`}>
                                    {message.type === 'success' ? <Shield size={16}/> : <AlertTriangle size={16}/>}
                                    {message.text}
                                </div>
                            )}

                            <form onSubmit={handleUpdateMain} className="space-y-5">
                                {/* Input Group: Full Name */}
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Full Name</label>
                                    <div className="relative mt-1">
                                        <User className="absolute left-3 top-3 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            name="full_name"
                                            value={formData.full_name}
                                            onChange={handleMainChange}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Input Group: Email (Disabled) */}
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Email</label>
                                    <div className="relative mt-1">
                                        <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            disabled
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 bg-gray-50 text-gray-500 rounded-xl cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                {/* Input Group: Phone */}
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Phone Number</label>
                                    <div className="relative mt-1">
                                        <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleMainChange}
                                            placeholder="0901234567"
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Input Group: Address */}
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Main Address</label>
                                    <div className="relative mt-1">
                                        <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleMainChange}
                                            rows="2"
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none"
                                        ></textarea>
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2">
                                    <Save size={18} /> Update Profile
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* DANGER ZONE */}
                    <div className="bg-red-50 p-6 rounded-2xl border border-red-200 hover:shadow-md transition">
                        <h3 className="text-red-800 font-bold flex items-center gap-2 mb-2">
                            <AlertTriangle size={20} /> Danger Zone
                        </h3>
                        <p className="text-sm text-red-600 mb-4 opacity-80">
                            Deletion is irreversible. All data will be lost.
                        </p>
                        <button
                            onClick={handleDeleteAccount}
                            className="w-full border border-red-300 bg-white text-red-600 hover:bg-red-600 hover:text-white font-bold py-2.5 rounded-xl transition-colors text-sm"
                        >
                            Delete My Account
                        </button>
                    </div>
                </div>

                {/* --- CỘT PHẢI: ADDRESS BOOK (Chiếm 8/12 cột) --- */}
                <div className="lg:col-span-8 space-y-8">

                    {/* FORM THÊM ĐỊA CHỈ MỚI */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-green-500"></div>
                        <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                            <span className="bg-green-100 text-green-600 p-2 rounded-lg">
                                <Plus size={20} />
                            </span>
                            Add New Address
                        </h3>

                        <form onSubmit={handleAddProfile} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <input
                                        name="title"
                                        value={newProfile.title}
                                        onChange={handleNewProfileChange}
                                        placeholder="Label (e.g. Home, Office)"
                                        className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div className="relative">
                                    <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    <input
                                        name="full_name"
                                        value={newProfile.full_name}
                                        onChange={handleNewProfileChange}
                                        placeholder="Contact Name"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <Phone className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                <input
                                    name="phone"
                                    value={newProfile.phone}
                                    onChange={handleNewProfileChange}
                                    placeholder="Phone Number (Digits only)"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 outline-none transition-all"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <MapPin className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                <textarea
                                    name="address"
                                    value={newProfile.address}
                                    onChange={handleNewProfileChange}
                                    placeholder="Full Address Detail"
                                    rows="2"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 outline-none transition-all resize-none"
                                    required
                                ></textarea>
                            </div>

                            <div className="flex justify-end">
                                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-green-500/30 transition-all flex items-center gap-2">
                                    <Save size={18} /> Save Address
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* DANH SÁCH ĐỊA CHỈ (GRID) */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-gray-700 flex items-center gap-2">
                            <MapPin className="text-blue-500" /> Saved Addresses ({profiles.length})
                        </h3>

                        {profiles.length === 0 ? (
                            <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-300 text-gray-400">
                                You haven't saved any addresses yet.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {profiles.map(profile => (
                                    <div key={profile.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all group relative">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${
                                                profile.title.toLowerCase() === 'home' ? 'bg-blue-100 text-blue-700' :
                                                    profile.title.toLowerCase() === 'office' ? 'bg-purple-100 text-purple-700' :
                                                        'bg-gray-100 text-gray-700'
                                            }`}>
                                                {profile.title.toLowerCase() === 'home' ? <Home size={12}/> :
                                                    profile.title.toLowerCase() === 'office' ? <Briefcase size={12}/> : <MapPin size={12}/>}
                                                {profile.title}
                                            </span>

                                            <button
                                                onClick={() => handleDeleteProfile(profile.id)}
                                                className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-all"
                                                title="Delete Address"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>

                                        <div className="space-y-2 text-sm text-gray-600">
                                            <p className="flex items-center gap-2 font-bold text-gray-800 text-base">
                                                {profile.full_name}
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <Phone size={14} className="text-gray-400" /> {profile.phone}
                                            </p>
                                            <p className="flex items-start gap-2 leading-relaxed">
                                                <MapPin size={14} className="mt-1 text-gray-400 flex-shrink-0" />
                                                {profile.address}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}