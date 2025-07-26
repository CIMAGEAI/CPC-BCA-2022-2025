import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminDashboard() {
    const [orders, setOrders] = useState([]);
    const [pendingProducts, setPendingProducts] = useState([]);

    // Fetch all orders
    useEffect(() => {
        axios.get('http://localhost:5000/api/orders')
            .then(res => setOrders(res.data))
            .catch(err => console.error(err));
    }, []);

    // Fetch all unapproved products
    useEffect(() => {
        axios.get('http://localhost:5000/api/products/pending')
            .then(res => setPendingProducts(res.data))
            .catch(err => console.error(err));
    }, []);

    const approveProduct = (productId) => {
        axios.put(`http://localhost:5000/api/products/approve/${productId}`)
            .then(() => {
                alert('Product Approved!');
                setPendingProducts(prev => prev.filter(p => p._id !== productId));
            })
            .catch(err => console.error(err));
    };

    return (
        <div style={{ padding: '1rem' }}>
            <h2>🧾 All Orders</h2>
            {orders.map(order => (
                <div key={order._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '1rem' }}>
                    <p><strong>Order ID:</strong> {order._id}</p>
                    <p><strong>Amount:</strong> ₹{order.totalAmount}</p>
                    <p><strong>Status:</strong> {order.status}</p>
                </div>
            ))}

            <hr />

            <h2>📦 Pending Product Approvals</h2>
            {pendingProducts.length === 0 ? (
                <p>No products pending approval.</p>
            ) : (
                pendingProducts.map(prod => (
                    <div key={prod._id} style={{ border: '1px solid #aaa', padding: '10px', marginBottom: '1rem' }}>
                        <h4>{prod.title}</h4>
                        <p>{prod.description}</p>
                        <p>₹{prod.pricePerDay}/day</p>
                        <button onClick={() => approveProduct(prod._id)}>✅ Approve</button>
                    </div>
                ))
            )}
        </div>
    );
}

export default AdminDashboard;
