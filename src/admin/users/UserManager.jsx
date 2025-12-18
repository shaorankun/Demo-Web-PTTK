import React, { useState, useEffect } from 'react';
import UserList from './UserList';
import api from '../../api';

export default function UserManager() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // State cho thanh tìm kiếm
    const [searchTerm, setSearchTerm] = useState('');

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
            fetchData();
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete user.");
        }
    };

    // === SEARCH LOGIC ===
    // Lọc user dựa trên tên hoặc email (không phân biệt hoa thường)
    const filteredUsers = users.filter(user =>
        (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return <div className="p-10 text-center">Loading users...</div>;

    return (
        <div className="container mx-auto p-6">
            <UserList
                users={filteredUsers} // Truyền danh sách đã lọc
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onDelete={handleDelete}
            />
        </div>
    );
}