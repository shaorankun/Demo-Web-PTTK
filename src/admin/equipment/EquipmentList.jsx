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
                                          onSearchSubmit
                                      }) {
    return (
        <div className="animate-fade-in">
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-3xl font-bold text-gray-800">Product Management</h2>

                <button
                    onClick={onShowForm}
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-2.5 rounded-lg shadow-lg hover:shadow-green-500/30 hover:from-green-700 hover:to-green-800 flex items-center gap-2 transform active:scale-95 transition-all duration-200 font-medium"
                >
                    <Plus className="w-5 h-5" /> Add Product
                </button>
            </div>

            {/* --- SEARCH --- */}
            <div className="mb-6 relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search equipment by name/desc and press Enter..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') onSearchSubmit();
                    }}
                    className="pl-10 w-full p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-300 shadow-sm"
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

            {/* --- TABLE --- */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        {/* 1. SỬA: text-left -> text-center */}
                        <th className="p-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Provider</th>
                        <th className="p-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="p-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                    {equipment.length > 0 ? (
                        equipment.map(equip => {
                            const catId = equip.category_id || equip.categoryId;
                            const provId = equip.provider_id || equip.providerId;

                            return (
                                <tr key={equip.id} className="hover:bg-blue-50 transition-colors duration-200 group">

                                    {/* 2. SỬA: Căn giữa nội dung Name & Description */}
                                    <td className="p-4 align-middle">
                                        <div className="flex flex-col items-center text-center">
                                            <div className="font-semibold text-gray-700">{equip.name}</div>
                                            {equip.description && (
                                                // Thêm mx-auto để căn giữa box truncate
                                                <p className="text-xs text-gray-500 truncate max-w-[200px] mt-0.5 mx-auto">
                                                    {equip.description}
                                                </p>
                                            )}
                                        </div>
                                    </td>

                                    <td className="p-4 text-green-600 font-bold align-middle">
                                        ${equip.price}
                                    </td>

                                    <td className="p-4 text-sm text-gray-600 align-middle">
                                        {categories.find(c => c.id === catId)?.name || <span className="text-gray-400 italic">---</span>}
                                    </td>

                                    <td className="p-4 text-sm text-gray-600 align-middle">
                                        {providers.find(p => p.id === provId)?.name || <span className="text-gray-400 italic">---</span>}
                                    </td>

                                    <td className="p-4 text-center align-middle">
                                            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${
                                                equip.stock < 5
                                                    ? 'bg-red-50 text-red-600 border-red-100'
                                                    : 'bg-gray-100 text-gray-600 border-gray-200'
                                            }`}>
                                                {equip.stock}
                                            </span>
                                    </td>

                                    <td className="p-4 align-middle">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => onEdit(equip)}
                                                className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-2 rounded-full transition-all"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onDelete(equip.id)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-100 p-2 rounded-full transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="6" className="p-10 text-center text-gray-400 italic">
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