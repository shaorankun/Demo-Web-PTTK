import React, { useState, useEffect } from 'react';
import CategoryList from './CategoryList'; // Bạn cần tạo file hiển thị danh sách này
import api from '../../api';

export default function CategoryManager() {
    // 1. Data State
    const [categories, setCategories] = useState([]);

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
            // Category thường đứng độc lập nên chỉ cần fetch chính nó
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (error) {
            console.error("Error loading categories:", error);
        } finally {
            setLoading(false);
        }
    };

    // === SAVE HANDLER (Create & Update) ===
    const handleSave = async (formData) => {
        try {
            if (formData.id) {
                // Update
                await api.put(`/categories/${formData.id}`, formData);
                alert('Category updated successfully!');
            } else {
                // Create
                await api.post('/categories', formData);
                alert('Category created successfully!');
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
        if (!window.confirm("Are you sure you want to delete this category?")) return;

        try {
            await api.delete(`/categories/${id}`);
            alert("Deleted successfully!");
            fetchData();
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete category.");
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

    if (loading) return <div className="p-10 text-center text-gray-500">Loading categories...</div>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Category Management</h1>

            {/* Component hiển thị bảng và form nhập liệu */}
            <CategoryList
                categories={categories}
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