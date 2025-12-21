import React from 'react';
import { Trash2, Search, Eye } from 'lucide-react';

export default function UserList({
                                     users,
                                     searchTerm,
                                     onSearchChange,
                                     onDelete,
                                     onView,
                                     onSearchSubmit // MỚI: Nhận prop hàm submit
                                 }) {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">User Management</h2>
            </div>

            {/* THANH SEARCH */}
            <div className="mb-6 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    // Cập nhật placeholder hướng dẫn người dùng
                    placeholder="Search by name/email and press Enter..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    // MỚI: Bắt sự kiện phím bấm
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            onSearchSubmit(); // Gọi hàm tìm kiếm khi bấm Enter
                        }
                    }}
                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="p-4 text-left">ID</th>
                        <th className="p-4 text-left">Full Name</th>
                        <th className="p-4 text-left">Email</th>
                        <th className="p-4 text-left">Role</th>
                        <th className="p-4 text-left">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.length > 0 ? (
                        users.map(u => (
                            <tr key={u.id} className="border-t hover:bg-gray-50">
                                <td className="p-4 text-gray-500">#{u.id}</td>
                                <td className="p-4 font-medium">{u.full_name}</td>
                                <td className="p-4">{u.email}</td>
                                <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                                        }`}>
                                            {u.role ? u.role.toUpperCase() : 'USER'}
                                        </span>
                                </td>
                                <td className="p-4 flex gap-2">
                                    <button
                                        onClick={() => onView(u)}
                                        className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded"
                                        title="View Details"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>

                                    <button
                                        onClick={() => onDelete(u.id)}
                                        className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded"
                                        title="Delete User"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="p-8 text-center text-gray-500">
                                No users found matching "{searchTerm}"
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}