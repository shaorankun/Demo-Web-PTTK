import React from 'react';
import { Trash2 } from 'lucide-react';

export default function CartItem({ item, onUpdateQty, onRemove }) {
    return (
        <div className="flex items-center justify-between border-b py-4">
            <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">${item.price}</p>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                        className="bg-gray-200 px-2 py-1 rounded"
                    >
                        -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                        onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                        className="bg-gray-200 px-2 py-1 rounded"
                    >
                        +
                    </button>
                </div>
                <span className="font-semibold w-20 text-right">
          ${(item.price * item.quantity).toFixed(2)}
        </span>
                <button
                    onClick={() => onRemove(item.id)}
                    className="text-red-600 hover:text-red-800"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}