import React, { useState } from 'react';

export default function ProviderForm({ provider, onSave, onCancel }) {
    // 1. Đổi tên state contact -> email
    const [name, setName] = useState(provider?.name || '');
    const [email, setEmail] = useState(provider?.email || '');
    const [phone, setPhone] = useState(provider?.phone || '');

    // Xử lý address: Lấy từ props hoặc để rỗng (để không bị lỗi thiếu trường)
    const address = provider?.address || null;

    const handleSubmit = () => {
        if (name && email && phone) {
            // 2. Gửi object đúng key khớp với Insomnia
            onSave({
                name,
                address, // Gửi address (dù là null) để khớp cấu trúc DB
                phone,
                email    // Key này phải là 'email'
            });
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">{provider ? 'Edit' : 'Add'} Provider</h3>
            <div className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        placeholder="e.g. Sony Vietnam"
                    />
                </div>

                {/* Đã sửa Label và Value thành Email */}
                <div>
                    <label className="block mb-1 font-medium">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        placeholder="e.g. contact@sony.com.vn"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Phone</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        placeholder="e.g. 0987654321"
                    />
                </div>

                <div className="flex gap-2 pt-2">
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Save
                    </button>
                    <button
                        onClick={onCancel}
                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}