import React from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import EquipmentForm from './EquipmentForm';

export default function EquipmentList({
                                          equipment,
                                          categories,
                                          providers,
                                          showForm,
                                          editItem,
                                          onEdit,
                                          onDelete,
                                          onSave,
                                          onShowForm,
                                          onCancelForm,
                                          searchTerm,
                                          onSearchChange,
                                          onSearchSubmit // MỚI: Nhận props hàm submit
                                      }) {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Product List</h2>
                <button
                    onClick={onShowForm}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Product
                </button>
            </div>

            {/* --- THANH TÌM KIẾM --- */}
            <div className="mb-6 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search equipment by name/desc and press Enter..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    // MỚI: Bắt sự kiện phím Enter
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            onSearchSubmit();
                        }
                    }}
                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>

            {showForm && (
                <EquipmentForm
                    equipment={editItem}
                    categories={categories}
                    providers={providers}
                    onSave={onSave}
                    onCancel={onCancelForm}
                />
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="p-4 text-left">Name</th>
                        <th className="p-4 text-left">Price</th>
                        <th className="p-4 text-left">Category</th>
                        <th className="p-4 text-left">Provider</th>
                        <th className="p-4 text-left">Stock</th>
                        <th className="p-4 text-left">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {equipment.length > 0 ? (
                        equipment.map(equip => {
                            // Xử lý fallback key nếu backend trả về snake_case hoặc camelCase
                            const catId = equip.category_id || equip.categoryId;
                            const provId = equip.provider_id || equip.providerId;

                            return (
                                <tr key={equip.id} className="border-t hover:bg-gray-50">
                                    <td className="p-4 font-medium">
                                        {equip.name}
                                        {/* Hiển thị một phần mô tả nếu có */}
                                        {equip.description && (
                                            <p className="text-xs text-gray-500 truncate max-w-[200px]">
                                                {equip.description}
                                            </p>
                                        )}
                                    </td>
                                    <td className="p-4 text-green-600 font-bold">${equip.price}</td>
                                    <td className="p-4">
                                        {categories.find(c => c.id === catId)?.name || '---'}
                                    </td>
                                    <td className="p-4">
                                        {providers.find(p => p.id === provId)?.name || '---'}
                                    </td>
                                    <td className="p-4">{equip.stock}</td>
                                    <td className="p-4 flex gap-2">
                                        <button
                                            onClick={() => onEdit(equip)}
                                            className="text-blue-600 hover:text-blue-800"
                                            title="Edit"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(equip.id)}
                                            className="text-red-600 hover:text-red-800"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="6" className="p-8 text-center text-gray-500">
                                No product found matching "{searchTerm}"
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}