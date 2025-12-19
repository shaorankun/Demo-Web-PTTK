import React, { useState, useEffect } from 'react';

export default function EquipmentForm({ equipment, categories, providers, onSave, onCancel }) {
    // SỬA 1 & 3: Map đúng tên biến từ DB (snake_case) và xử lý hiển thị số 0
    const [name, setName] = useState(equipment?.name || '');
    const [price, setPrice] = useState(equipment?.price || '');
    // DB trả về category_id, không phải categoryId
    const [categoryId, setCategoryId] = useState(equipment?.category_id || equipment?.categoryId || '');
    // DB trả về provider_id, không phải providerId
    const [providerId, setProviderId] = useState(equipment?.provider_id || equipment?.providerId || '');

    // Nếu stock là 0 thì vẫn lấy 0, chỉ khi undefined/null mới lấy ''
    const [stock, setStock] = useState(equipment?.stock !== undefined ? equipment.stock : '');
    const [description, setDescription] = useState(equipment?.description || '');

    // Cập nhật lại state nếu props equipment thay đổi (quan trọng khi chuyển từ Add sang Edit mà không reload trang)
    useEffect(() => {
        if (equipment) {
            setName(equipment.name || '');
            setPrice(equipment.price || '');
            setCategoryId(equipment.category_id || equipment.categoryId || '');
            setProviderId(equipment.provider_id || equipment.providerId || '');
            setStock(equipment.stock !== undefined ? equipment.stock : '');
            setDescription(equipment.description || '');
        }
    }, [equipment]);

    const handleSubmit = () => {
        // Kiểm tra validation
        if (name && price && categoryId && providerId) {
            onSave({
                id: equipment?.id,
                name,
                price: parseFloat(price),
                // SỬA 2: Gửi đúng tên biến mà Backend (Controller) đang đợi (snake_case)
                category_id: parseInt(categoryId), // Đổi categoryId -> category_id
                provider_id: parseInt(providerId), // Đổi providerId -> provider_id
                stock: parseInt(stock) || 0,
                image: equipment?.image || '', // Backend có hứng image, nên gửi kèm hoặc giữ nguyên
                description
            });
        } else {
            alert("Please fill required fields (Name, Price, Category, Provider)");
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">{equipment ? 'Edit' : 'Add'} Product</h3>
            <div className="grid grid-cols-2 gap-4">
                {/* Các ô input giữ nguyên, chỉ sửa logic state ở trên */}
                <div>
                    <label className="block mb-1 font-medium">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Price</label>
                    <input
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Category</label>
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block mb-1 font-medium">Provider</label>
                    <select
                        value={providerId}
                        onChange={(e) => setProviderId(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="">Select Provider</option>
                        {providers.map(prov => (
                            <option key={prov.id} value={prov.id}>{prov.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block mb-1 font-medium">Stock</label>
                    <input
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Description</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div className="col-span-2 flex gap-2">
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Save
                    </button>
                    <button
                        onClick={onCancel}
                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}