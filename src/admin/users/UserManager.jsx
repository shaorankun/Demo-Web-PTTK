import React, { useState, useEffect } from 'react';
import UserList from './UserList';
import UserDetailModal from './UserDetailModal'; // MỚI: Import Modal
import api from '../../api';

export default function UserManager() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // State cho thanh tìm kiếm
    const [searchTerm, setSearchTerm] = useState('');

    // MỚI: State cho modal chi tiết
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await api.get('/users');
            setUsers(res.data);
        } catch (error) {
            console.error("Error loading users:", error);
        } finally {
            setLoading(false);
        }
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
            fetchData();
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete user.");
        }
    };

    // === VIEW DETAIL ===
    const handleViewDetail = (user) => {
        setSelectedUser(user);
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
    };

    // === SEARCH LOGIC ===
    const filteredUsers = users.filter(user =>
        (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return <div className="p-10 text-center">Loading users...</div>;

    return (
        <div className="container mx-auto p-6 relative">
            <UserList
                users={filteredUsers}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onDelete={handleDelete}
                onView={handleViewDetail} // MỚI: Truyền hàm view xuống
            />

            {/* MỚI: Render Modal nếu có selectedUser */}
            {selectedUser && (
                <UserDetailModal
                    user={selectedUser}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}