import React, { useState, useEffect } from 'react';
import { X, Save, Image as ImageIcon } from 'lucide-react';

export default function EquipmentForm({ equipment, categories, providers, onSave, onCancel }) {
    // 1. Chuyển sang dùng 1 Object State (formData) để quản lý gọn gàng hơn
    const [formData, setFormData] = useState({
        id: null,
        name: '',
        price: '',
        category_id: '',
        provider_id: '',
        stock: '',
        description: '',
        image: '' // MỚI: Thêm trường image
    });

    // 2. Map dữ liệu từ props vào state (Giữ logic mapping của bạn)
    useEffect(() => {
        if (equipment) {
            setFormData({
                id: equipment.id,
                name: equipment.name || '',
                price: equipment.price || '',
                // Logic map ID: ưu tiên snake_case từ DB
                category_id: equipment.category_id || equipment.categoryId || '',
                provider_id: equipment.provider_id || equipment.providerId || '',
                // Logic stock: giữ số 0 nếu có
                stock: equipment.stock !== undefined ? equipment.stock : '',
                description: equipment.description || '',
                image: equipment.image || '' // Load ảnh cũ
            });
        } else {
            // Reset về rỗng nếu là Add New
            setFormData({
                id: null, name: '', price: '', category_id: '', provider_id: '', stock: '', description: '', image: ''
            });
        }
    }, [equipment]);

    // Hàm xử lý thay đổi input chung
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validation
        if (formData.name && formData.price && formData.category_id && formData.provider_id) {
            onSave({
                ...formData,
                price: parseFloat(formData.price),
                category_id: parseInt(formData.category_id),
                provider_id: parseInt(formData.provider_id),
                stock: parseInt(formData.stock) || 0,
                // image và description đã có sẵn trong spread operator ...formData
            });
        } else {
            alert("Please fill required fields (Name, Price, Category, Provider)");
        }
    };

    return (
        // Dùng Modal (Fixed Overlay) để giao diện nhập liệu tập trung và đẹp hơn
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b bg-gray-50 sticky top-0 z-10">
                    <h3 className="text-xl font-bold text-gray-800">
                        {equipment ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    <button onClick={onCancel} className="text-gray-400 hover:text-red-500 transition">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* --- CỘT TRÁI: NHẬP THÔNG TIN --- */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                <input required name="name" type="text" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
                                <input required name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                <select name="category_id" value={formData.category_id} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option value="">-- Select --</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Provider *</label>
                                <select name="provider_id" value={formData.provider_id} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option value="">-- Select --</option>
                                    {providers.map(prov => (
                                        <option key={prov.id} value={prov.id}>{prov.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                            <input name="stock" type="number" value={formData.stock} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea name="description" rows="3" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
                        </div>
                    </div>

                    {/* --- CỘT PHẢI: HÌNH ẢNH & PREVIEW --- */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                            <div className="relative">
                                <ImageIcon className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                <input
                                    name="image"
                                    type="text"
                                    value={formData.image}
                                    onChange={handleChange}
                                    className="w-full pl-9 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    placeholder="Paste image link here..."
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Accepts .jpg, .png, .webp links</p>
                        </div>

                        {/* KHUNG PREVIEW ẢNH */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg h-56 flex items-center justify-center bg-gray-50 overflow-hidden relative">
                            {formData.image ? (
                                <img
                                    src={formData.image}
                                    alt="Preview"
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                        e.target.style.display = 'none'; // Ẩn ảnh lỗi
                                        e.target.nextSibling.style.display = 'flex'; // Hiện thông báo lỗi
                                    }}
                                />
                            ) : (
                                <div className="text-center text-gray-400">
                                    <ImageIcon size={40} className="mx-auto mb-2 opacity-50" />
                                    <p className="text-xs">Image preview</p>
                                </div>
                            )}

                            {/* Thông báo lỗi ảnh (Mặc định ẩn, hiện khi onError kích hoạt) */}
                            <div className="absolute inset-0 hidden flex-col items-center justify-center bg-gray-50 text-red-400">
                                <p className="text-xs font-bold">Image load failed</p>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Footer Buttons */}
                <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 sticky bottom-0 z-10">
                    <button onClick={onCancel} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-100 font-medium">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium flex items-center gap-2">
                        <Save size={18} />
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}