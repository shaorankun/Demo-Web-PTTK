import React from 'react';
import { X, User, Mail, Shield, Phone, MapPin, Calendar } from 'lucide-react';

export default function UserDetailModal({ user, onClose }) {
    if (!user) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden animate-fade-in-up">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b bg-gray-50">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <User className="text-blue-600" />
                        User Details
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full p-1 transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {/* Top Section: Avatar & Role */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold uppercase">
                            {user.full_name ? user.full_name.charAt(0) : 'U'}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">{user.full_name}</h2>
                            <p className="text-gray-500">ID: #{user.id}</p>
                            <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                            }`}>
                                {user.role || 'USER'}
                            </span>
                        </div>
                    </div>

                    {/* Grid Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                                <Mail size={14} /> Email Address
                            </label>
                            <p className="text-gray-800 font-medium">{user.email}</p>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                                <Phone size={14} /> Phone Number
                            </label>
                            <p className="text-gray-800 font-medium">
                                {user.phone || 'Not provided'}
                            </p>
                        </div>

                        <div className="space-y-1 md:col-span-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                                <MapPin size={14} /> Address
                            </label>
                            <p className="text-gray-800 font-medium">
                                {user.address || 'No address information available'}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                                <Calendar size={14} /> Account Created
                            </label>
                            <p className="text-gray-800 font-medium">
                                {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                                <Shield size={14} /> Status
                            </label>
                            <p className="text-green-600 font-bold flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span> Active
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t bg-gray-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-100 font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}