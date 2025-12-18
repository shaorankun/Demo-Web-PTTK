import React, { useState } from 'react';

export default function UserForm({ user, onSave, onCancel }) {
    // 1. Đổi state name -> fullName và lấy từ user.full_name
    const [fullName, setFullName] = useState(user?.full_name || '');
    const [email, setEmail] = useState(user?.email || '');
    // Role rất quan trọng để admin phân quyền
    const [role, setRole] = useState(user?.role || 'user');

    const handleSubmit = () => {
        if (fullName && email) {
            onSave({
                id: user.id, // Luôn có ID vì chỉ sửa
                full_name: fullName, // 2. Gửi key full_name khớp với DB
                email,
                role
            });
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-blue-500">
            <h3 className="text-xl font-bold mb-4">Edit User</h3>
            <div className="space-y-4">
                <div>
                    {/* 3. Đổi Label và Value Input */}
                    <label className="block mb-1 font-medium">Full Name</label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Role</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full border rounded px-3 py-2 bg-white"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div className="flex gap-2 pt-2">
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Update User
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