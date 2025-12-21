import React, { useState, useEffect } from 'react';
import EquipmentList from './EquipmentList';
import api from '../../api';

export default function EquipmentManager() {
    // 1. Data State
    const [equipments, setEquipments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [providers, setProviders] = useState([]);

    // State tìm kiếm
    const [searchTerm, setSearchTerm] = useState('');

    // 2. UI State
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState(null);

    // 3. Fetch Data on Mount
    useEffect(() => {
        fetchData(); // Load all lần đầu
    }, []);

    // --- SỬA: Nhận keyword để gọi API ---
    const fetchData = async (keyword = '') => {
        try {
            setLoading(true);

            // Xây dựng URL cho equipment (có search)
            const equipUrl = keyword ? `/equipments?search=${keyword}` : '/equipments';

            const [equipRes, catRes, provRes] = await Promise.all([
                api.get(equipUrl),
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

            // Chỉ set categories/providers nếu chưa có (để tối ưu, hoặc cứ set lại cũng ko sao)
            setCategories(catRes.data);
            setProviders(provRes.data);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- MỚI: Hàm xử lý khi bấm Enter ---
    const handleSearchSubmit = () => {
        fetchData(searchTerm);
    };

    // === SAVE HANDLER ===
    const handleSave = async (formData) => {
        // Check duplicate ở client (Chỉ check được trên danh sách đang hiển thị)
        const isDuplicate = equipments.some(item =>
            item.name.trim().toLowerCase() === formData.name.trim().toLowerCase() &&
            item.id !== formData.id
        );

        if (isDuplicate) {
            alert("Product existed! Please choose another name");
            return;
        }

        try {
            if (formData.id) {
                await api.put(`/equipments/${formData.id}`, formData);
                alert('Update successful!');
            } else {
                await api.post('/equipments', formData);
                alert('Created successfully!');
            }
            // Load lại data với từ khóa tìm kiếm hiện tại
            fetchData(searchTerm);
            handleCancelForm();
        } catch (error) {
            console.error("Save error:", error);
            const message = error.response?.data?.message || error.message;
            alert(`Operation failed: ${message}`);
        }
    };

    // === DELETE HANDLER ===
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.delete(`/equipments/${id}`);
            alert("Deleted successfully!");
            // Load lại data với từ khóa tìm kiếm hiện tại
            fetchData(searchTerm);
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete item.");
        }
    };

    // UI Helpers
    const handleShowAddForm = () => { setEditItem(null); setShowForm(true); };
    const handleEdit = (item) => { setEditItem(item); setShowForm(true); };
    const handleCancelForm = () => { setShowForm(false); setEditItem(null); };

    // --- BỎ logic lọc filteredEquipments ở đây ---

    if (loading) return <div className="p-10 text-center text-gray-500">Loading data...</div>;

    return (
        <div className="container mx-auto p-6">

            <EquipmentList
                // Truyền trực tiếp equipments (vì API đã lọc rồi)
                equipment={equipments}
                categories={categories}
                providers={providers}

                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                // Truyền hàm submit xuống view
                onSearchSubmit={handleSearchSubmit}

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