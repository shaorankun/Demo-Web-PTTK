import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import CategoryForm from './CategoryForm';

export default function CategoryList({
                                         categories,
                                         showForm,
                                         editItem,
                                         onAdd,
                                         onEdit,
                                         onDelete,
                                         onSave,
                                         onShowForm,
                                         onCancelForm
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
                    {categories.map(cat => (
                        <tr key={cat.id} className="border-t">
                            <td className="p-4">{cat.name}</td>
                            <td className="p-4">{cat.description}</td>
                            <td className="p-4 flex gap-2">
                                <button
                                    onClick={() => onEdit(cat)}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => onDelete(cat.id)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}