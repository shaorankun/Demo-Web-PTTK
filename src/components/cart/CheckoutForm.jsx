import React, { useState, useEffect } from 'react';
import { MapPin, User, Phone, ChevronDown, CreditCard, Banknote } from 'lucide-react'; // Thêm icon thanh toán
import api from '../../api';

export default function CheckoutForm({ cart, onConfirm, onCancel }) {
    const [info, setInfo] = useState({ name: '', address: '', phone: '' });

    // 1. State cho Payment Method (Mặc định là COD)
    const [paymentMethod, setPaymentMethod] = useState('COD');

    const [profiles, setProfiles] = useState([]);
    const [selectedProfileId, setSelectedProfileId] = useState('new');
    const [loadingProfiles, setLoadingProfiles] = useState(true);

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
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

    const handleProfileChange = (e) => {
        const id = e.target.value;
        setSelectedProfileId(id);

        if (id === 'new') {
            setInfo({ name: '', address: '', phone: '' });
        } else {
            const profile = profiles.find(p => p.id == id);
            if (profile) {
                setInfo({
                    name: profile.full_name,
                    phone: profile.phone,
                    address: profile.address
                });
            }
        }
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = total * 0.1;
    const finalTotal = total + tax;

    const handleSubmit = (e) => {
        e.preventDefault();
        // 2. Gửi thêm paymentMethod vào object data
        onConfirm({
            ...info,
            payment_method: paymentMethod, // Quan trọng
            total: finalTotal
        });
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg mt-10">
            <h2 className="text-2xl font-bold mb-6 text-blue-600 border-b pb-2">Checkout</h2>

            {/* Order Summary */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Total Items:</span>
                    <span className="font-bold">{cart.length}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="text-red-600 text-xl font-bold">${finalTotal.toFixed(2)}</span>
                </div>
            </div>

            {/* Select Profile (Giữ nguyên) */}
            <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-gray-700">Select Saved Address</label>
                <div className="relative">
                    <select
                        value={selectedProfileId}
                        onChange={handleProfileChange}
                        className="w-full p-3 pl-4 pr-10 border border-blue-300 bg-blue-50 rounded text-gray-700 appearance-none focus:ring-2 focus:ring-blue-500 outline-none"
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
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Inputs Info (Giữ nguyên) */}
                <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700 flex items-center gap-1">
                        <User size={16} /> Full Name
                    </label>
                    <input
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
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
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
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
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        value={info.address}
                        onChange={e => setInfo({...info, address: e.target.value})}
                        placeholder="123 Main St..."
                    />
                </div>

                {/* --- PHẦN MỚI: PAYMENT METHOD --- */}
                <div className="mt-6 border-t pt-4">
                    <label className="block text-sm font-semibold mb-3 text-gray-700">Payment Method</label>

                    <div className="space-y-3">
                        {/* Option 1: COD */}
                        <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${paymentMethod === 'COD' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:bg-gray-50'}`}>
                            <input
                                type="radio"
                                name="payment"
                                value="COD"
                                checked={paymentMethod === 'COD'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-5 h-5 text-blue-600"
                            />
                            <div className="ml-3 flex items-center gap-2">
                                <Banknote className="text-green-600" size={20} />
                                <span className="font-medium text-gray-800">Cash on Delivery (COD)</span>
                            </div>
                        </label>

                        {/* Option 2: BANK */}
                        <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${paymentMethod === 'BANK' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:bg-gray-50'}`}>
                            <input
                                type="radio"
                                name="payment"
                                value="BANK"
                                checked={paymentMethod === 'BANK'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-5 h-5 text-blue-600"
                            />
                            <div className="ml-3 flex items-center gap-2">
                                <CreditCard className="text-blue-600" size={20} />
                                <span className="font-medium text-gray-800">Bank Transfer</span>
                            </div>
                        </label>
                    </div>

                    {/* Hiển thị thông tin chuyển khoản nếu chọn Bank */}
                    {paymentMethod === 'BANK' && (
                        <div className="mt-3 p-3 bg-gray-100 rounded text-sm text-gray-700 border border-gray-300">
                            <p className="font-bold">Bank Info:</p>
                            <p>Bank: Vietcombank</p>
                            <p>Account: 999988887777</p>
                            <p>Name: BO MAY</p>
                            <p className="mt-1 text-xs text-gray-500">Please include your phone number in the transfer content.</p>
                        </div>
                    )}
                </div>
                {/* -------------------------------- */}

                <div className="flex gap-3 justify-end mt-6">
                    <button type="button" onClick={onCancel} className="px-5 py-2 border border-gray-300 rounded hover:bg-gray-100">
                        Back
                    </button>
                    <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold shadow">
                        Confirm Payment
                    </button>
                </div>
            </form>
        </div>
    );
}