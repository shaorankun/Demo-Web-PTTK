import React from 'react';
import CartItem from './CartItem';

export default function CartView({ cart, onUpdateQty, onRemove, onCheckout, onContinueShopping }) {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (cart.length === 0) {
        return (
            <div>
                <h2 className="text-3xl font-bold mb-6">Shopping Cart</h2>
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <p className="text-gray-500 text-lg">Your cart is empty</p>
                    <button
                        onClick={onContinueShopping}
                        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Shopping Cart</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
                    {cart.map(item => (
                        <CartItem
                            key={item.id}
                            item={item}
                            onUpdateQty={onUpdateQty}
                            onRemove={onRemove}
                        />
                    ))}
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 h-fit">
                    <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tax (10%)</span>
                            <span>${(total * 0.1).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                            <span>Total</span>
                            <span>${(total * 1.1).toFixed(2)}</span>
                        </div>
                    </div>
                    <button
                        onClick={onCheckout}
                        className="w-full bg-green-600 text-white px-4 py-3 rounded hover:bg-green-700 font-semibold"
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
}