import React, { useState, useEffect } from 'react';
import EquipmentList from './EquipmentList';
import api from '../../api'; // Đường dẫn api tùy vào cấu trúc folder của bạn

export default function EquipmentManager() {
    // 1. Data State
    const [equipments, setEquipments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [providers, setProviders] = useState([]);

    // --- MỚI: State tìm kiếm ---
    const [searchTerm, setSearchTerm] = useState('');

    // 2. UI State
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState(null);

    // 3. Fetch Data on Mount
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [equipRes, catRes, provRes] = await Promise.all([
                api.get('/equipments'),
                api.get('/categories'),
                api.get('/providers')
            ]);

            const formattedEquip = equipRes.data.map(item => ({
                ...item,
                categoryId: item.category_id,
                providerId: item.provider_id,
                image: item.image || 'https://placehold.co/400x300?text=No+Image'
            }));

            setEquipments(formattedEquip);
            setCategories(catRes.data);
            setProviders(provRes.data);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    };

    // === SAVE HANDLER (Đã thêm check trùng tên) ===
    const handleSave = async (formData) => {
        // 1. KIỂM TRA TRÙNG TÊN
        const isDuplicate = equipments.some(item =>
            // So sánh tên (bỏ khoảng trắng + chữ thường)
            item.name.trim().toLowerCase() === formData.name.trim().toLowerCase() &&
            // Nếu đang update thì bỏ qua chính nó
            item.id !== formData.id
        );

        if (isDuplicate) {
            alert("Equipment existed! Please choose another name");
            return; // Dừng, không gọi API
        }

        // 2. GỌI API (Logic cũ)
        try {
            if (formData.id) {
                await api.put(`/equipments/${formData.id}`, formData);
                alert('Update successful!');
            } else {
                await api.post('/equipments', formData);
                alert('Created successfully!');
            }
            fetchData();
            handleCancelForm();
        } catch (error) {
            console.error("Save error:", error);
            // Nếu Backend trả về lỗi trùng, hiển thị ra luôn
            const message = error.response?.data?.message || error.message;
            alert(`Operation failed: ${message}`);
        }
    };

    // === DELETE HANDLER ===
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this equipment?")) return;
        try {
            await api.delete(`/equipments/${id}`);
            alert("Deleted successfully!");
            fetchData();
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete item.");
        }
    };

    // UI Helpers
    const handleShowAddForm = () => { setEditItem(null); setShowForm(true); };
    const handleEdit = (item) => { setEditItem(item); setShowForm(true); };
    const handleCancelForm = () => { setShowForm(false); setEditItem(null); };

    // --- MỚI: Logic lọc danh sách theo tên hoặc mô tả ---
    const filteredEquipments = equipments.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return <div className="p-10 text-center text-gray-500">Loading data...</div>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Equipment Management</h1>

            <EquipmentList
                // Truyền danh sách đã lọc thay vì danh sách gốc
                equipment={filteredEquipments}
                categories={categories}
                providers={providers}

                // Truyền props tìm kiếm
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}

                showForm={showForm}
                editItem={editItem}
                onShowForm={handleShowAddForm}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSave={handleSave}
                onCancelForm={handleCancelForm}
            />
        </div>
    );
}