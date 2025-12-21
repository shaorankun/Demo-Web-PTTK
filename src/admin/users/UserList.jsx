import React from 'react';
import { Trash2, Search, Eye } from 'lucide-react';

export default function UserList({
                                     users,
                                     searchTerm,
                                     onSearchChange,
                                     onDelete,
                                     onView,
                                     onSearchSubmit // Giữ nguyên prop submit
                                 }) {
    return (
        <div className="animate-fade-in"> {/* Hiệu ứng hiện dần */}

            {/* --- HEADER --- */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">User Management</h2>
                {/* Ở đây không có nút Add User vì thường User tự đăng ký,
                    nhưng nếu cần có thể thêm vào vị trí này */}
            </div>

            {/* --- THANH TÌM KIẾM --- */}
            <div className="mb-6 relative max-w-md"> {/* Giới hạn chiều rộng */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                {/* INPUT: Bo tròn xl, Focus ring đẹp */}
                <input
                    type="text"
                    placeholder="Search by name/email and press Enter..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    // Logic bắt sự kiện phím Enter giữ nguyên
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            onSearchSubmit();
                        }
                    }}
                    className="pl-10 w-full p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-300 shadow-sm"
                />
            </div>

            {/* --- TABLE CONTAINER --- */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <table className="w-full">
                    {/* TABLE HEADER: Nền xám, chữ in hoa */}
                    <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</th>
                        <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="p-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>

                    {/* TABLE BODY */}
                    <tbody className="divide-y divide-gray-100">
                    {users.length > 0 ? (
                        users.map(u => (
                            // ROW: Hover xanh nhạt
                            <tr key={u.id} className="hover:bg-blue-50 transition-colors duration-200 group">
                                <td className="p-4 text-gray-400 font-mono text-sm">#{u.id}</td>

                                <td className="p-4 font-semibold text-gray-700">
                                    {u.full_name}
                                </td>

                                <td className="p-4 text-gray-600 text-sm">
                                    {u.email}
                                </td>

                                <td className="p-4">
                                    {/* BADGE ROLE: Bo tròn, viền nhẹ, màu sắc rõ ràng */}
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                        u.role === 'admin'
                                            ? 'bg-purple-50 text-purple-700 border-purple-100'
                                            : 'bg-green-50 text-green-700 border-green-100'
                                    }`}>
                                            {u.role ? u.role.toUpperCase() : 'USER'}
                                        </span>
                                </td>

                                <td className="p-4">
                                    <div className="flex justify-end gap-2">
                                        {/* VIEW BUTTON: Hover xanh */}
                                        <button
                                            onClick={() => onView(u)}
                                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-2 rounded-full transition-all"
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>

                                        {/* DELETE BUTTON: Hover đỏ */}
                                        <button
                                            onClick={() => onDelete(u.id)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-100 p-2 rounded-full transition-all"
                                            title="Delete User"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="p-10 text-center text-gray-400 italic">
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