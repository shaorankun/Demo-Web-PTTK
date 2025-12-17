import React, { useState, useEffect } from 'react';
import ProviderList from './ProviderList';
import api from '../../api';

export default function ProviderManager() {
    // 1. Data State
    const [providers, setProviders] = useState([]);

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
            const res = await api.get('/providers');
            setProviders(res.data);
        } catch (error) {
            console.error("Error loading providers:", error);
        } finally {
            setLoading(false);
        }
    };

    // === SAVE HANDLER (Create & Update) ===
    const handleSave = async (formData) => {
        try {
            // Tạo một object dữ liệu chuẩn, thêm address: null vào để tránh lỗi undefined
            const dataToSend = {
                ...formData,
                // address: null // <--- Thêm dòng này: Nếu DB cho phép null
                address: "" // <--- Dùng dòng này nếu DB bắt buộc có dữ liệu (NOT NULL)
            };

            if (editItem) {
                // UPDATE
                await api.put(`/providers/${editItem.id}`, {
                    id: editItem.id,
                    ...dataToSend
                });
                alert('Provider updated successfully!');
            } else {
                // CREATE
                await api.post('/providers', dataToSend);
                alert('Provider created successfully!');
            }

            fetchData();
            handleCancelForm();
        } catch (error) {
            console.error("Save error:", error);
            const message = error.response?.data?.message || error.message;
            alert(`Operation failed: ${message}`);
        }
    };

    // === DELETE HANDLER ===
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this provider?")) return;

        try {
            await api.delete(`/providers/${id}`);
            alert("Deleted successfully!");
            fetchData();
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete provider.");
        }
    };

    // UI Helpers
    const handleShowAddForm = () => {
        setEditItem(null);
        setShowForm(true);
    };

    const handleEdit = (item) => {
        setEditItem(item);
        setShowForm(true);
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditItem(null);
    };

    if (loading) return <div className="p-10 text-center text-gray-500">Loading providers...</div>;

    return (
        <div className="container mx-auto p-6">
            <ProviderList
                providers={providers}
                showForm={showForm}
                editItem={editItem} // Truyền prop này để form biết là đang edit hay add

                onShowForm={handleShowAddForm}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSave={handleSave}
                onCancelForm={handleCancelForm}
            />
        </div>
    );
}