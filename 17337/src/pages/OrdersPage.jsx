import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import OrderDetailsModal from '../components/OrderDetailsModal';
import '../styles/OrdersPage.css';
import { FaDownload } from 'react-icons/fa';
import jsPDF from 'jspdf'; 
import autoTable from 'jspdf-autotable'; 


const BACKEND_URL = process.env.NODE_ENV === 'production'
  ? 'https://ecommerce-app-pi86.onrender.com'
  : 'http://localhost:5000';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const [isReordering, setIsReordering] = useState(null); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
      else setLoading(false);
    });
    return () => unsubscribe();
  }, []); 

  useEffect(() => {
    if (!userId) return;
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_URL}/api/orders/${userId}`);
        const data = await response.json();
        if (data.success) setOrders(data.orders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userId]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  const handleDownload = (order) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('Order Invoice', 14, 22);
    doc.setFontSize(12);
    doc.text(`Order ID: ${order.merchantOrderId}`, 14, 32);
    doc.text(`Date: ${new Date(order.createdAt._seconds * 1000).toLocaleString()}`, 14, 39);
    doc.text(`Total Amount: INR ${order.amount.toLocaleString()}`, 14, 46);

    const tableColumn = ["Product", "Quantity", "Price"];
    const tableRows = [];
    order.products.forEach(product => {
      const productData = [
        product.title,
        product.quantity,
        `INR ${product.price.toLocaleString()}`
      ];
      tableRows.push(productData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 56, 
    });

    const finalY = doc.lastAutoTable.finalY; 
    doc.setFontSize(14);
    doc.text('Shipping Details', 14, finalY + 15);
    doc.setFontSize(12);
    doc.text(`${order.shippingDetails.name}`, 14, finalY + 22);
    doc.text(`${order.shippingDetails.address}`, 14, finalY + 29);
    doc.text(`Email: ${order.shippingDetails.email}`, 14, finalY + 36);
    doc.text(`Phone: ${order.shippingDetails.phone}`, 14, finalY + 43);

    doc.save(`invoice-${order.merchantOrderId}.pdf`);
  };

  const handleReorder = async (order) => {
    setIsReordering(order.id);
    try {
        const response = await fetch(`${BACKEND_URL}/api/pay`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                amount: order.amount,
                products: order.products,
                shippingDetails: order.shippingDetails,
                userId: order.userId,
                existingMerchantOrderId: order.merchantOrderId 
            }),
        });
        
        const data = await response.json();
        if (data.success && data.redirectUrl) {
            window.location.href = data.redirectUrl;
        } else {
            throw new Error(data.message || "Failed to initiate reorder.");
        }
    } catch (error) {
        console.error("Reorder failed:", error);
        alert("Could not start a new payment. Please try again.");
        setIsReordering(null);
    }
  };

  if (loading) {
    return <div className="container"><h2>Loading your orders...</h2></div>;
  }

  if (!userId) {
    return <div className="container"><h2>Please log in to view your orders.</h2></div>;
  }

  return (
    <>
      <div className="container">
        <h2>My Orders</h2>
        {orders.length > 0 ? (
          <div className="order-list-professional">
            <div className="order-header">
              <div className="header-item">Order ID</div>
              <div className="header-item">Date</div>
              <div className="header-item">Amount</div>
              <div className="header-item">Status</div>
              <div className="header-item">Actions</div>
            </div>
            {orders.map((order) => (
              <div key={order.id} className="order-row">
                <div className="order-cell" data-label="Order ID">{order.merchantOrderId}</div>
                <div className="order-cell" data-label="Date">{new Date(order.createdAt._seconds * 1000).toLocaleDateString()}</div>
                <div className="order-cell" data-label="Amount">₹{order.amount.toLocaleString()}</div>
                <div className="order-cell" data-label="Status">
                  <span className={`status-badge status-${order.status?.toLowerCase()}`}>{order.status}</span>
                </div>
                
                <div className="order-cell button-group" data-label="Actions">
                  
                  <button className="details-button" onClick={() => handleViewDetails(order)}>
                    View Details
                  </button>
                  
                  {(order.status === 'PENDING' || order.status === 'FAILED') && (
                    <button 
                        className="reorder-button" 
                        onClick={() => handleReorder(order)}
                        disabled={isReordering === order.id}
                    >
                      {isReordering === order.id ? 'Processing...' : 'Retry Payment'}
                    </button>
                  )}
                  
                  {order.status === 'COMPLETED' && (
                    <button
                        className="download-button"
                        title={'Download Invoice (PDF)'}
                        onClick={() => handleDownload(order)}
                    >
                        <FaDownload />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>You have not placed any orders yet.</p>
        )}
      </div>
      {selectedOrder && <OrderDetailsModal order={selectedOrder} onClose={handleCloseModal} />}
    </>
  );
};

export default OrdersPage;