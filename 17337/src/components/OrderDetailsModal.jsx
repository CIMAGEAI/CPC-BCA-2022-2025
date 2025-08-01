import React from 'react';
import '../styles/OrderDetailsModal.css';

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) {
    return null;
  }

  const orderDate = new Date(order.createdAt._seconds * 1000).toLocaleString();
  const { shippingDetails, products } = order;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Order Details</h3>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="order-summary-modal">
            <p><strong>Order ID:</strong> {order.merchantOrderId}</p>
            <p><strong>Order Date:</strong> {orderDate}</p>
            <p><strong>Total Amount:</strong> ₹{order.amount.toLocaleString()}</p>
          </div>
          
          <div className="shipping-details">
            <h4>Shipping Address</h4>
            <p>{shippingDetails.name}</p>
            <p>{shippingDetails.address}</p>
            {/* <p>{shippingDetails.city}, {shippingDetails.state} - {shippingDetails.zip}</p> */}
            <p><strong>Phone:</strong> {shippingDetails.phone}</p>
          </div>

          <div className="products-list">
            <h4>Items in this Order</h4>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                    <td>₹{product.price.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;