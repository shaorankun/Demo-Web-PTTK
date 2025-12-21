import React, { useState, useEffect } from 'react';
import CategoryList from './CategoryList';
import api from '../../api';

export default function CategoryManager() {
    // 1. Data State
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // State lưu từ khóa

    // 2. UI State
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState(null);

    // 3. Fetch Data on Mount
    useEffect(() => {
        fetchData(); // Gọi lần đầu không tham số (lấy tất cả)
    }, []);

    // --- SỬA: fetchData nhận tham số keyword ---
    const fetchData = async (keyword = '') => {
        try {
            setLoading(true);
            // Nếu có keyword thì thêm param ?search=..., nếu không thì gọi api gốc
            const url = keyword ? `/categories?search=${keyword}` : '/categories';
            const res = await api.get(url);
            setCategories(res.data);
        } catch (error) {
            console.error("Error loading categories:", error);
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
        // Lưu ý: Logic check duplicate client-side này chỉ hiệu quả với những item ĐANG hiển thị.
        // Backend vẫn là chốt chặn cuối cùng.
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
            // Load lại dữ liệu theo từ khóa tìm kiếm hiện tại (hoặc '' để lấy tất cả)
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
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            await api.delete(`/categories/${id}`);
            alert("Deleted successfully!");
            fetchData(searchTerm); // Load lại danh sách sau khi xóa
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete category.");
        }
    };

    // UI Helpers
    const handleShowAddForm = () => { setEditItem(null); setShowForm(true); };
    const handleEdit = (item) => { setEditItem(item); setShowForm(true); };
    const handleCancelForm = () => { setShowForm(false); setEditItem(null); };

    // --- BỎ: const filteredCategories = ... (Không lọc ở client nữa) ---

    if (loading) return <div className="p-10 text-center text-gray-500">Loading categories...</div>;

    return (
        <div className="w-full min-h-screen p-6 bg-gray-50">


            <CategoryList
                // Truyền trực tiếp categories (vì API đã trả về kết quả lọc rồi)
                categories={categories}

                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}

                // MỚI: Truyền hàm xử lý Enter xuống dưới
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