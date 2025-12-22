import React, { useState, useEffect } from 'react';
import CategoryList from './CategoryList';
import api from '../../api';

export default function CategoryManager() {
    // 1. Data State
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // 2. UI State
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState(null);

    // 3. Fetch Data on Mount
    useEffect(() => {
        fetchData();
    }, []);

    // --- FETCH DATA ---
    const fetchData = async (keyword = '') => {
        try {
            // Không set loading = true mỗi lần search để tránh nháy màn hình (Optional)
            if (categories.length === 0) setLoading(true);

            const url = keyword ? `/categories?search=${keyword}` : '/categories';
            const res = await api.get(url);
            setCategories(res.data);
        } catch (error) {
            console.error("Error loading categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchSubmit = () => {
        fetchData(searchTerm);
    };

    // === SAVE HANDLER ===
    const handleSave = async (formData) => {
        // Client-side duplicate check (Optional - Backend chốt chặn cuối cùng)
        const isDuplicate = categories.some(cat =>
            cat.name.trim().toLowerCase() === formData.name.trim().toLowerCase() &&
            cat.id !== formData.id
        );

        if (isDuplicate) {
            alert("Category name existed! Please choose another name");
            return;
        }

        try {
            if (formData.id) {
                await api.put(`/categories/${formData.id}`, formData);
                alert('Category updated successfully!');
            } else {
                await api.post('/categories', formData);
                alert('Category created successfully!');
            }
            fetchData(searchTerm);
            handleCancelForm();
        } catch (error) {
            console.error("Save error:", error);
            // Lấy message lỗi cụ thể từ Backend (ví dụ: duplicate name, invalid format...)
            const message = error.response?.data?.message || error.message;
            alert(`Operation failed: ${message}`);
        }
    };

    // === DELETE HANDLER (ĐÃ SỬA LOGIC) ===
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;

        try {
            await api.delete(`/categories/${id}`);
            alert("Deleted successfully!");
            fetchData(searchTerm);
        } catch (error) {
            console.error("Delete error:", error);

            // [QUAN TRỌNG] Lấy message lỗi từ Backend trả về
            // Nếu Backend trả về 400 kèm message "Cannot delete...", nó sẽ hiện ở đây
            const errorMsg = error.response?.data?.message || "Failed to delete category.";

            alert(`ERROR: ${errorMsg}`);
        }
    };

    // UI Helpers
    const handleShowAddForm = () => { setEditItem(null); setShowForm(true); };
    const handleEdit = (item) => { setEditItem(item); setShowForm(true); };
    const handleCancelForm = () => { setShowForm(false); setEditItem(null); };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-2"></div>
            Loading categories...
        </div>
    );

    return (
        // Thêm animate-fade-in cho đồng bộ
        <div className="w-full min-h-screen p-6 bg-gray-50 animate-fade-in">
            <CategoryList
                categories={categories}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
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