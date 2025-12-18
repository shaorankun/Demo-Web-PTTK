import React, { useState, useEffect } from 'react';
import { MapPin, User, Phone, ChevronDown } from 'lucide-react'; // Thêm icon cho đẹp
import api from '../../api'; // Đảm bảo import axios instance của bạn

export default function CheckoutForm({ cart, onConfirm, onCancel }) {
    // State form nhập liệu
    const [info, setInfo] = useState({ name: '', address: '', phone: '' });

    // State quản lý danh sách Profile
    const [profiles, setProfiles] = useState([]);
    const [selectedProfileId, setSelectedProfileId] = useState('new'); // Mặc định là nhập mới
    const [loadingProfiles, setLoadingProfiles] = useState(true);

    // 1. Lấy danh sách Profile từ Backend khi vào trang
    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                // Giả sử route bạn tạo ở Controller profile là /profiles
                const res = await api.get('/profiles');
                setProfiles(res.data);
            } catch (error) {
                console.error("Failed to load profiles", error);
            } finally {
                setLoadingProfiles(false);
            }
        };
        fetchProfiles();
    }, []);

    // 2. Xử lý khi chọn dropdown Profile
    const handleProfileChange = (e) => {
        const id = e.target.value;
        setSelectedProfileId(id);

        if (id === 'new') {
            // Nếu chọn nhập mới -> Xóa trắng form
            setInfo({ name: '', address: '', phone: '' });
        } else {
            // Tìm profile tương ứng trong list
            const profile = profiles.find(p => p.id == id);
            if (profile) {
                // Tự động điền vào form
                // Lưu ý: Mapping đúng key từ DB (full_name) sang state của form (name)
                setInfo({
                    name: profile.full_name,
                    phone: profile.phone,
                    address: profile.address
                });
            }
        }
    };

    // Calculate Total
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = total * 0.1; // 10% tax
    const finalTotal = total + tax;

    const handleSubmit = (e) => {
        e.preventDefault();
        // Gửi data bao gồm thông tin ship và tổng tiền
        onConfirm({ ...info, total: finalTotal });
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg mt-10">
            <h2 className="text-2xl font-bold mb-6 text-blue-600 border-b pb-2">Shipping Details</h2>

            {/* Order Summary */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Total Items:</span>
                    <span className="font-bold">{cart.length}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Amount (Tax incl.):</span>
                    <span className="text-red-600 text-xl font-bold">${finalTotal.toFixed(2)}</span>
                </div>
            </div>

            {/* --- PHẦN MỚI: CHỌN PROFILE --- */}
            <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Select Saved Address
                </label>
                <div className="relative">
                    <select
                        value={selectedProfileId}
                        onChange={handleProfileChange}
                        className="w-full p-3 pl-4 pr-10 border border-blue-300 bg-blue-50 rounded text-gray-700 appearance-none focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                        disabled={loadingProfiles}
                    >
                        <option value="new">-- Enter a new address --</option>
                        {profiles.map(profile => (
                            <option key={profile.id} value={profile.id}>
                                {profile.title} ({profile.full_name})
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-500 pointer-events-none" />
                </div>
                {profiles.length === 0 && !loadingProfiles && (
                    <p className="text-xs text-gray-500 mt-1">You define profiles in your account settings.</p>
                )}
            </div>
            {/* -------------------------------- */}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700 flex items-center gap-1">
                        <User size={16} /> Full Name
                    </label>
                    <input
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={info.name}
                        onChange={e => setInfo({...info, name: e.target.value})}
                        placeholder="John Doe"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700 flex items-center gap-1">
                        <Phone size={16} /> Phone Number
                    </label>
                    <input
                        required
                        type="tel"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={info.phone}
                        onChange={e => setInfo({...info, phone: e.target.value})}
                        placeholder="+1 234 567 890"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700 flex items-center gap-1">
                        <MapPin size={16} /> Shipping Address
                    </label>
                    <textarea
                        required
                        rows="3"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={info.address}
                        onChange={e => setInfo({...info, address: e.target.value})}
                        placeholder="123 Main St, New York, NY..."
                    />
                </div>

                <div className="flex gap-3 justify-end mt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-5 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold shadow transition"
                    >
                        Confirm Payment
                    </button>
                </div>
            </form>
        </div>
    );
}