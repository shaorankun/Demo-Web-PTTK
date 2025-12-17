import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Edit2, Trash2, Package, Users, FolderTree } from 'lucide-react';

// Mock data initialization
const initCategories = [
    { id: 1, name: 'Laptops', description: 'Portable computers' },
    { id: 2, name: 'Smartphones', description: 'Mobile devices' },
    { id: 3, name: 'Accessories', description: 'Electronic accessories' }
];

const initProviders = [
    { id: 1, name: 'Tech Supplier Co.', contact: 'contact@techsupplier.com', phone: '123-456-7890' },
    { id: 2, name: 'Global Electronics', contact: 'info@globalelec.com', phone: '098-765-4321' }
];

const initEquipment = [
    { id: 1, name: 'Dell XPS 15', price: 1499, categoryId: 1, providerId: 1, stock: 15, description: 'High-performance laptop' },
    { id: 2, name: 'iPhone 15 Pro', price: 999, categoryId: 2, providerId: 2, stock: 25, description: 'Latest smartphone' },
    { id: 3, name: 'Wireless Mouse', price: 29, categoryId: 3, providerId: 1, stock: 50, description: 'Ergonomic mouse' }
];

export default function ElectronicsShop() {
    const [view, setView] = useState('shop');
    const [categories, setCategories] = useState(initCategories);
    const [providers, setProviders] = useState(initProviders);
    const [equipment, setEquipment] = useState(initEquipment);
    const [cart, setCart] = useState([]);
    const [editItem, setEditItem] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // Category CRUD
    const addCategory = (cat) => {
        setCategories([...categories, { ...cat, id: Date.now() }]);
        setShowForm(false);
    };

    const updateCategory = (id, cat) => {
        setCategories(categories.map(c => c.id === id ? { ...cat, id } : c));
        setEditItem(null);
        setShowForm(false);
    };

    const deleteCategory = (id) => {
        if (confirm('Delete this category?')) {
            setCategories(categories.filter(c => c.id !== id));
        }
    };

    // Provider CRUD
    const addProvider = (prov) => {
        setProviders([...providers, { ...prov, id: Date.now() }]);
        setShowForm(false);
    };

    const updateProvider = (id, prov) => {
        setProviders(providers.map(p => p.id === id ? { ...prov, id } : p));
        setEditItem(null);
        setShowForm(false);
    };

    const deleteProvider = (id) => {
        if (confirm('Delete this provider?')) {
            setProviders(providers.filter(p => p.id !== id));
        }
    };

    // Equipment CRUD
    const addEquipment = (equip) => {
        setEquipment([...equipment, { ...equip, id: Date.now() }]);
        setShowForm(false);
    };

    const updateEquipment = (id, equip) => {
        setEquipment(equipment.map(e => e.id === id ? { ...equip, id } : e));
        setEditItem(null);
        setShowForm(false);
    };

    const deleteEquipment = (id) => {
        if (confirm('Delete this equipment?')) {
            setEquipment(equipment.filter(e => e.id !== id));
        }
    };

    // Cart & Payment
    const addToCart = (item) => {
        const existing = cart.find(c => c.id === item.id);
        if (existing) {
            setCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
        } else {
            setCart([...cart, { ...item, quantity: 1 }]);
        }
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(c => c.id !== id));
    };

    const updateCartQty = (id, qty) => {
        if (qty <= 0) {
            removeFromCart(id);
        } else {
            setCart(cart.map(c => c.id === id ? { ...c, quantity: qty } : c));
        }
    };

    const checkout = () => {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        alert(`Payment of $${total.toFixed(2)} processed successfully!`);
        setCart([]);
        setView('shop');
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-blue-600 text-white p-4 shadow-lg">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold">ElectroShop</h1>
                    <nav className="flex gap-4 items-center">
                        <button onClick={() => setView('shop')} className="hover:underline">Shop</button>
                        <button onClick={() => setView('categories')} className="hover:underline">Categories</button>
                        <button onClick={() => setView('equipment')} className="hover:underline">Equipment</button>
                        <button onClick={() => setView('providers')} className="hover:underline">Providers</button>
                        <button onClick={() => setView('cart')} className="relative">
                            <ShoppingCart />
                            {cart.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {cart.length}
                </span>
                            )}
                        </button>
                    </nav>
                </div>
            </header>

            <main className="container mx-auto p-6">
                {/* Shop View */}
                {view === 'shop' && (
                    <div>
                        <h2 className="text-3xl font-bold mb-6">Products</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {equipment.map(item => (
                                <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
                                    <div className="bg-gray-200 h-48 rounded mb-4 flex items-center justify-center">
                                        <Package className="w-16 h-16 text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                                    <p className="text-gray-600 mb-2">{item.description}</p>
                                    <p className="text-sm text-gray-500 mb-2">
                                        Category: {categories.find(c => c.id === item.categoryId)?.name}
                                    </p>
                                    <p className="text-sm text-gray-500 mb-4">Stock: {item.stock}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-2xl font-bold text-blue-600">${item.price}</span>
                                        <button
                                            onClick={() => addToCart(item)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Categories Management */}
                {view === 'categories' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold">Categories</h2>
                            <button
                                onClick={() => { setShowForm(true); setEditItem(null); }}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> Add Category
                            </button>
                        </div>

                        {showForm && (
                            <CategoryForm
                                category={editItem}
                                onSave={editItem ? (data) => updateCategory(editItem.id, data) : addCategory}
                                onCancel={() => { setShowForm(false); setEditItem(null); }}
                            />
                        )}

                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-4 text-left">Name</th>
                                    <th className="p-4 text-left">Description</th>
                                    <th className="p-4 text-left">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {categories.map(cat => (
                                    <tr key={cat.id} className="border-t">
                                        <td className="p-4">{cat.name}</td>
                                        <td className="p-4">{cat.description}</td>
                                        <td className="p-4 flex gap-2">
                                            <button
                                                onClick={() => { setEditItem(cat); setShowForm(true); }}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteCategory(cat.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Equipment Management */}
                {view === 'equipment' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold">Equipment</h2>
                            <button
                                onClick={() => { setShowForm(true); setEditItem(null); }}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> Add Equipment
                            </button>
                        </div>

                        {showForm && (
                            <EquipmentForm
                                equipment={editItem}
                                categories={categories}
                                providers={providers}
                                onSave={editItem ? (data) => updateEquipment(editItem.id, data) : addEquipment}
                                onCancel={() => { setShowForm(false); setEditItem(null); }}
                            />
                        )}

                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-4 text-left">Name</th>
                                    <th className="p-4 text-left">Price</th>
                                    <th className="p-4 text-left">Category</th>
                                    <th className="p-4 text-left">Provider</th>
                                    <th className="p-4 text-left">Stock</th>
                                    <th className="p-4 text-left">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {equipment.map(equip => (
                                    <tr key={equip.id} className="border-t">
                                        <td className="p-4">{equip.name}</td>
                                        <td className="p-4">${equip.price}</td>
                                        <td className="p-4">{categories.find(c => c.id === equip.categoryId)?.name}</td>
                                        <td className="p-4">{providers.find(p => p.id === equip.providerId)?.name}</td>
                                        <td className="p-4">{equip.stock}</td>
                                        <td className="p-4 flex gap-2">
                                            <button
                                                onClick={() => { setEditItem(equip); setShowForm(true); }}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteEquipment(equip.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Providers Management */}
                {view === 'providers' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold">Providers</h2>
                            <button
                                onClick={() => { setShowForm(true); setEditItem(null); }}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> Add Provider
                            </button>
                        </div>

                        {showForm && (
                            <ProviderForm
                                provider={editItem}
                                onSave={editItem ? (data) => updateProvider(editItem.id, data) : addProvider}
                                onCancel={() => { setShowForm(false); setEditItem(null); }}
                            />
                        )}

                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-4 text-left">Name</th>
                                    <th className="p-4 text-left">Contact</th>
                                    <th className="p-4 text-left">Phone</th>
                                    <th className="p-4 text-left">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {providers.map(prov => (
                                    <tr key={prov.id} className="border-t">
                                        <td className="p-4">{prov.name}</td>
                                        <td className="p-4">{prov.contact}</td>
                                        <td className="p-4">{prov.phone}</td>
                                        <td className="p-4 flex gap-2">
                                            <button
                                                onClick={() => { setEditItem(prov); setShowForm(true); }}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteProvider(prov.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Cart & Checkout */}
                {view === 'cart' && (
                    <div>
                        <h2 className="text-3xl font-bold mb-6">Shopping Cart</h2>
                        {cart.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                                <p className="text-gray-500 text-lg">Your cart is empty</p>
                                <button
                                    onClick={() => setView('shop')}
                                    className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
                                    {cart.map(item => (
                                        <div key={item.id} className="flex items-center justify-between border-b py-4">
                                            <div className="flex-1">
                                                <h3 className="font-semibold">{item.name}</h3>
                                                <p className="text-gray-600">${item.price}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => updateCartQty(item.id, item.quantity - 1)}
                                                        className="bg-gray-200 px-2 py-1 rounded"
                                                    >
                                                        -
                                                    </button>
                                                    <span>{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateCartQty(item.id, item.quantity + 1)}
                                                        className="bg-gray-200 px-2 py-1 rounded"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <span className="font-semibold w-20 text-right">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
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
                                        onClick={checkout}
                                        className="w-full bg-green-600 text-white px-4 py-3 rounded hover:bg-green-700 font-semibold"
                                    >
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

// Forms Components
function CategoryForm({ category, onSave, onCancel }) {
    const [name, setName] = useState(category?.name || '');
    const [description, setDescription] = useState(category?.description || '');

    const handleSubmit = () => {
        if (name && description) {
            onSave({ name, description });
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">{category ? 'Edit' : 'Add'} Category</h3>
            <div className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Description</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div className="flex gap-2">
                    <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Save
                    </button>
                    <button onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

function ProviderForm({ provider, onSave, onCancel }) {
    const [name, setName] = useState(provider?.name || '');
    const [contact, setContact] = useState(provider?.contact || '');
    const [phone, setPhone] = useState(provider?.phone || '');

    const handleSubmit = () => {
        if (name && contact && phone) {
            onSave({ name, contact, phone });
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">{provider ? 'Edit' : 'Add'} Provider</h3>
            <div className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Contact Email</label>
                    <input
                        type="email"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Phone</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div className="flex gap-2">
                    <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Save
                    </button>
                    <button onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

function EquipmentForm({ equipment, categories, providers, onSave, onCancel }) {
    const [name, setName] = useState(equipment?.name || '');
    const [price, setPrice] = useState(equipment?.price || '');
    const [categoryId, setCategoryId] = useState(equipment?.categoryId || '');
    const [providerId, setProviderId] = useState(equipment?.providerId || '');
    const [stock, setStock] = useState(equipment?.stock || '');
    const [description, setDescription] = useState(equipment?.description || '');

    const handleSubmit = () => {
        if (name && price && categoryId && providerId && stock && description) {
            onSave({
                name,
                price: parseFloat(price),
                categoryId: parseInt(categoryId),
                providerId: parseInt(providerId),
                stock: parseInt(stock),
                description
            });
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">{equipment ? 'Edit' : 'Add'} Equipment</h3>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block mb-1 font-medium">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Price</label>
                    <input
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Category</label>
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block mb-1 font-medium">Provider</label>
                    <select
                        value={providerId}
                        onChange={(e) => setProviderId(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="">Select Provider</option>
                        {providers.map(prov => (
                            <option key={prov.id} value={prov.id}>{prov.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block mb-1 font-medium">Stock</label>
                    <input
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Description</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div className="col-span-2 flex gap-2">
                    <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Save
                    </button>
                    <button onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}