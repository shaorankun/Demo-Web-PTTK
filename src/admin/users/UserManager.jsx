import React, { useState, useEffect } from 'react';
import UserList from './UserList';
import UserDetailModal from './UserDetailModal';
import api from '../../api';

export default function UserManager() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // State cho thanh tìm kiếm
    const [searchTerm, setSearchTerm] = useState('');

    // State cho modal chi tiết
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchData(); // Load lần đầu (lấy tất cả)
    }, []);

    // --- SỬA: Nhận keyword để gọi API tìm kiếm ---
    const fetchData = async (keyword = '') => {
        try {
            setLoading(true);
            // Nếu có keyword thì thêm param ?search=..., nếu không thì gọi api gốc
            const url = keyword ? `/users?search=${keyword}` : '/users';
            const res = await api.get(url);
            setUsers(res.data);
        } catch (error) {
            console.error("Error loading users:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- MỚI: Hàm xử lý khi bấm Enter ---
    const handleSearchSubmit = () => {
        fetchData(searchTerm);
    };

    // === DELETE ONLY ===
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure? This action cannot be undone.")) return;
        try {
            await api.delete(`/users/${id}`);
            alert("User deleted successfully!");

            // Nếu user đang mở modal bị xóa thì đóng modal
            if (selectedUser && selectedUser.id === id) {
                setSelectedUser(null);
            }
            // Load lại danh sách với từ khóa tìm kiếm hiện tại
            fetchData(searchTerm);
        } catch (error) {
            console.error("Delete error:", error);
            const msg = error.response?.data?.message || "Failed to delete user.";
            alert(msg);
        }
    };

    // === VIEW DETAIL ===
    const handleViewDetail = (user) => {
        setSelectedUser(user);
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
    };

    // --- BỎ: const filteredUsers = ... (Không lọc ở client nữa) ---

    if (loading) return <div className="p-10 text-center">Loading users...</div>;

    return (
        <div className="container mx-auto p-6 relative">
            <UserList
                // Truyền trực tiếp danh sách users (đã được API lọc)
                users={users}

                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}

                // MỚI: Truyền hàm submit xuống dưới
                onSearchSubmit={handleSearchSubmit}

                onDelete={handleDelete}
                onView={handleViewDetail}
            />

            {/* Modal */}
            {selectedUser && (
                <UserDetailModal
                    user={selectedUser}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}