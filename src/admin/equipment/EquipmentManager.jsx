import React, { useState, useEffect } from 'react';
import EquipmentList from './EquipmentList';
// Import api instance (configured with VITE_API_URL)
import api from '../../api';

export default function EquipmentManager() {
    // 1. Data State
    const [equipments, setEquipments] = useState([]);
    const [categories, setCategories] = useState([]);
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
            // Fetch all required data in parallel
            const [equipRes, catRes, provRes] = await Promise.all([
                api.get('/equipments'),
                api.get('/categories'),
                api.get('/providers')
            ]);

            // Format equipment data to match UI expectations
            // (Mapping snake_case from DB to camelCase for React components if needed)
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

    // === SAVE HANDLER (Create & Update) ===
    const handleSave = async (formData) => {
        try {
            // If ID exists -> Update (PUT)
            // If No ID -> Create (POST)
            if (formData.id) {
                console.log("Updating ID:", formData.id);
                await api.put(`/equipments/${formData.id}`, formData);
                alert('Update successful!');
            } else {
                console.log("Creating new item...");
                await api.post('/equipments', formData);
                alert('Created successfully!');
            }

            // Refresh list & Close form
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

    if (loading) return <div className="p-10 text-center text-gray-500">Loading data...</div>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Equipment Management</h1>

            <EquipmentList
                equipment={equipments}
                categories={categories}
                providers={providers}
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