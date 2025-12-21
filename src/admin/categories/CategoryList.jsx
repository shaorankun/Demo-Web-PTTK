import React from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import CategoryForm from './CategoryForm';

export default function CategoryList({
                                         categories,
                                         showForm,
                                         editItem,
                                         onEdit,
                                         onDelete,
                                         onSave,
                                         onShowForm,
                                         onCancelForm,
                                         searchTerm,
                                         onSearchChange,
                                         onSearchSubmit // Giữ nguyên prop submit
                                     }) {
    return (
        <div className="animate-fade-in"> {/* Thêm hiệu ứng hiện dần */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-3xl font-bold text-gray-800">Category Management</h2>

                {/* BUTTON ADD: Gradient + Shadow + Animation */}
                <button
                    onClick={onShowForm}
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-2.5 rounded-lg shadow-lg hover:shadow-green-500/30 hover:from-green-700 hover:to-green-800 flex items-center gap-2 transform active:scale-95 transition-all duration-200 font-medium"
                >
                    <Plus className="w-5 h-5" /> Add Category
                </button>
            </div>

            {/* --- THANH TÌM KIẾM --- */}
            <div className="mb-6 relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                {/* INPUT: Focus ring đẹp hơn, bo tròn xl */}
                <input
                    type="text"
                    placeholder="Search categories and press Enter..."
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

            {/* Form Modal (Nếu bạn đã sửa CategoryForm thành modal thì nó sẽ hiện đè lên) */}
            {showForm && (
                <CategoryForm
                    category={editItem}
                    onSave={onSave}
                    onCancel={onCancelForm}
                />
            )}

            {/* TABLE CONTAINER: Shadow lớn, bo góc, border nhẹ */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <table className="w-full">
                    {/* TABLE HEADER: Nền xám, chữ in hoa, font nhỏ đậm */}
                    <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="p-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>

                    {/* TABLE BODY: Chia dòng mờ */}
                    <tbody className="divide-y divide-gray-100">
                    {categories.length > 0 ? (
                        categories.map(cat => (
                            // TABLE ROW: Hover màu xanh nhạt
                            <tr key={cat.id} className="hover:bg-blue-50 transition-colors duration-200 group">
                                <td className="p-4 font-semibold text-gray-700">{cat.name}</td>
                                <td className="p-4 text-gray-600 text-sm">{cat.description}</td>
                                <td className="p-4">
                                    <div className="flex justify-end gap-2">
                                        {/* BUTTON EDIT: Tròn, hover xanh dương */}
                                        <button
                                            onClick={() => onEdit(cat)}
                                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-2 rounded-full transition-all"
                                            title="Edit"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        {/* BUTTON DELETE: Tròn, hover đỏ */}
                                        <button
                                            onClick={() => onDelete(cat.id)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-100 p-2 rounded-full transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="p-10 text-center text-gray-400 italic">
                                No categories found matching "{searchTerm}"
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}