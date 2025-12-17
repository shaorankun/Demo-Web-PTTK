import React, { useState } from 'react';

export default function CheckoutForm({ cart, onConfirm, onCancel }) {
    const [info, setInfo] = useState({ name: '', address: '', phone: '' });

    // Calculate Total
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = total * 0.1; // 10% tax
    const finalTotal = total + tax;

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm({ ...info, total: finalTotal });
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg mt-10">
            <h2 className="text-2xl font-bold mb-6 text-blue-600 border-b pb-2">Shipping Details</h2>

            {/* Order Summary */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Total Items:</span>
                    <span className="font-bold">{cart.length}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Amount (Tax incl.):</span>
                    <span className="text-red-600 text-xl font-bold">${finalTotal.toFixed(2)}</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">Full Name</label>
                    <input
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={info.name}
                        onChange={e => setInfo({...info, name: e.target.value})}
                        placeholder="John Doe"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">Phone Number</label>
                    <input
                        required
                        type="tel"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={info.phone}
                        onChange={e => setInfo({...info, phone: e.target.value})}
                        placeholder="+1 234 567 890"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">Shipping Address</label>
                    <textarea
                        required
                        rows="3"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={info.address}
                        onChange={e => setInfo({...info, address: e.target.value})}
                        placeholder="123 Main St, New York, NY..."
                    />
                </div>

                <div className="flex gap-3 justify-end mt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-5 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold shadow transition"
                    >
                        Confirm Payment
                    </button>
                </div>
            </form>
        </div>
    );
}