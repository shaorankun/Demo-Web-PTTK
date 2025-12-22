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
        fetchData();
    }, []);

    // Nhận keyword để gọi API tìm kiếm
    const fetchData = async (keyword = '') => {
        try {
            // Không set loading = true ở đây để tránh nháy màn hình khi search
            // Chỉ set loading lần đầu tiên hoặc nếu bạn muốn hiệu ứng loading mỗi khi search
            if (users.length === 0) setLoading(true);

            const url = keyword ? `/users?search=${keyword}` : '/users';
            const res = await api.get(url);
            setUsers(res.data);
        } catch (error) {
            console.error("Error loading users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchSubmit = () => {
        fetchData(searchTerm);
    };

    // === DELETE USER (CÓ LOGIC BẢO VỆ ADMIN) ===
    const handleDelete = async (id) => {
        // 1. Tìm user đang định xóa
        const userToDelete = users.find(u => u.id === id);

        // 2. KIỂM TRA: Nếu user đó là Admin
        if (userToDelete && userToDelete.role === 'admin') {
            // Đếm số lượng admin hiện có
            const adminCount = users.filter(u => u.role === 'admin').length;

            // Nếu chỉ còn 1 admin (là chính người này) -> CHẶN
            if (adminCount <= 1) {
                alert("ACTION DENIED: You cannot delete the only remaining Administrator in the system.");
                return; // Dừng lại ngay
            }
        }

        // 3. Nếu không phải Admin cuối cùng -> Hỏi xác nhận xóa
        if (!window.confirm(`Are you sure you want to delete user "${userToDelete?.full_name || 'this user'}"? This action cannot be undone.`)) return;

        try {
            await api.delete(`/users/${id}`);
            alert("User deleted successfully!");

            // Nếu user đang mở modal bị xóa thì đóng modal
            if (selectedUser && selectedUser.id === id) {
                setSelectedUser(null);
            }

            // Cập nhật UI ngay lập tức (Optimistic update) cho mượt
            setUsers(prevUsers => prevUsers.filter(u => u.id !== id));

        } catch (error) {
            console.error("Delete error:", error);
            const msg = error.response?.data?.message || "Failed to delete user.";
            alert(msg);
            // Nếu lỗi đồng bộ data, load lại từ server
            fetchData(searchTerm);
        }
    };

    // === VIEW DETAIL ===
    const handleViewDetail = (user) => {
        setSelectedUser(user);
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-2"></div>
            Loading users...
        </div>
    );

    return (
        // Thêm animate-fade-in và background
        <div className="w-full min-h-screen p-6 bg-gray-50 animate-fade-in">
            <UserList
                users={users}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
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