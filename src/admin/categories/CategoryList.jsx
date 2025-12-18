import React from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react'; // MỚI: Import Search
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
                                         // MỚI: Nhận props tìm kiếm
                                         searchTerm,
                                         onSearchChange
                                     }) {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Categories</h2>
                <button
                    onClick={onShowForm}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Category
                </button>
            </div>

            {/* --- MỚI: THANH TÌM KIẾM --- */}
            <div className="mb-6 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>

            {showForm && (
                <CategoryForm
                    category={editItem}
                    onSave={onSave}
                    onCancel={onCancelForm}
                />
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="p-4 text-left">Name</th>
                        <th className="p-4 text-left">Description</th>
                        <th className="p-4 text-left">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {categories.length > 0 ? (
                        categories.map(cat => (
                            <tr key={cat.id} className="border-t hover:bg-gray-50">
                                <td className="p-4 font-medium">{cat.name}</td>
                                <td className="p-4 text-gray-600">{cat.description}</td>
                                <td className="p-4 flex gap-2">
                                    <button
                                        onClick={() => onEdit(cat)}
                                        className="text-blue-600 hover:text-blue-800"
                                        title="Edit"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(cat.id)}
                                        className="text-red-600 hover:text-red-800"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        // MỚI: Hiển thị khi không tìm thấy kết quả
                        <tr>
                            <td colSpan="3" className="p-8 text-center text-gray-500">
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