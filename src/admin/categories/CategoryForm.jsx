import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

export default function CategoryForm({ category, onSave, onCancel }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    // Load data if editing
    useEffect(() => {
        if (category) {
            setName(category.name || '');
            setDescription(category.description || '');
        }
    }, [category]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // 1. Validate: Name cannot be empty
        if (!name.trim()) {
            alert("Category Name is required.");
            return;
        }

        // 2. Validate: Special characters check
        // Allow: Letters (a-z, A-Z), Numbers (0-9), Spaces, and Vietnamese accents
        // Block: Special symbols like @, #, $, %, etc.
        const specialCharRegex = /^[a-zA-Z0-9\s\u00C0-\u1EF9-]+$/;

        if (!specialCharRegex.test(name)) {
            alert("Invalid Format: Category Name must contain only letters, numbers, and spaces.");
            return;
        }

        // 3. Submit if valid
        onSave({
            id: category?.id,
            name,
            description
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-up">

                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b bg-gray-50">
                    <h3 className="text-xl font-bold text-gray-800">
                        {category ? 'Edit Category' : 'Add New Category'}
                    </h3>
                    <button onClick={onCancel} className="text-gray-400 hover:text-red-500 transition">
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    {/* Name Input */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Category Name *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                            placeholder="e.g. Laptops"
                            autoFocus
                        />
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <AlertCircle size={12} /> No special characters allowed
                        </p>
                    </div>

                    {/* Description Input */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                        <textarea
                            rows="3"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none"
                            placeholder="Brief description..."
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30 transition flex items-center gap-2"
                        >
                            <Save size={18} /> Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}