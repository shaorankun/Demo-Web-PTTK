import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
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
                                          onCancelForm
                                      }) {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Equipment</h2>
                <button
                    onClick={onShowForm}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Equipment
                </button>
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
                    {equipment.map(equip => {
                        // FIX: Tìm category dựa trên cả 2 trường hợp tên biến (Backend trả về _id, Frontend dùng Id)
                        const catId = equip.category_id || equip.categoryId;
                        const provId = equip.provider_id || equip.providerId;

                        return (
                            <tr key={equip.id} className="border-t">
                                <td className="p-4">{equip.name}</td>
                                <td className="p-4">${equip.price}</td>
                                <td className="p-4">
                                    {categories.find(c => c.id === catId)?.name || '---'}
                                </td>
                                <td className="p-4">
                                    {providers.find(p => p.id === provId)?.name || '---'}
                                </td>
                                <td className="p-4">{equip.stock}</td>
                                <td className="p-4 flex gap-2">
                                    <button
                                        onClick={() => onEdit(equip)} // Khi bấm Edit, truyền toàn bộ object equip vào
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(equip.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}