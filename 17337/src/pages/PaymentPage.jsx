import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase"; 
import "../styles/CheckoutPage.css";
import "../styles/PaymentPage.css";

const BACKEND_URL = process.env.NODE_ENV === 'production'
  ? 'https://ecommerce-app-pi86.onrender.com' 
  : 'http://localhost:5000';                   

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { products, shippingDetails } = state || {};
  

  useEffect(() => {
    if (!products || !shippingDetails) {
      console.warn("Missing payment data. Redirecting to home.");
      navigate("/");
    }
  }, [products, shippingDetails, navigate]);

  const total = products ? products.reduce((acc, p) => acc + p.price * p.quantity, 0) : 0;

  const handlePayment = async () => {
    setIsLoading(true);
    setError("");

    if (!auth.currentUser) {
      setError("You must be logged in to make a payment.");
      setIsLoading(false);
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
      amount: total,
      products: products,
      shippingDetails: { 
        ...shippingDetails, 
        email: auth.currentUser.email 
      },
      userId: auth.currentUser.uid,
    }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Payment initiation failed.");
      }

      const data = await response.json();
      if (data.success && data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        throw new Error("Could not get payment URL.");
      }
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  if (!products) return null;

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Confirm Order & Pay</h2>

      <div className="order-summary">
        <h3>Order Summary</h3>
        {products.map((item, index) => (
          <div className="summary-item" key={index}>
            <span>{item.title} (x{item.quantity})</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <div className="summary-item total">
          <span>Total Amount:</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>

      <div className="shipping-summary">
        <h3>Shipping To</h3>
        <p><strong>{shippingDetails.name}</strong></p>
        <p>{shippingDetails.address}</p>
        <p>Phone: {shippingDetails.phone}</p>
      </div>

      <button
        className="checkout-confirm-btn"
        onClick={handlePayment}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : `Pay ₹${total.toFixed(2)} with PhonePe`}
      </button>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default PaymentPage;