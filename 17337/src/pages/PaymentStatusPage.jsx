import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/PaymentStatusPage.css'

const BACKEND_URL = process.env.NODE_ENV === 'production'
  ? 'https://ecommerce-app-pi86.onrender.com' 
  : 'http://localhost:5000';                  

const Loader = () => (
    <div className="loader-container">
        <div className="loader"></div>
        <p>Verifying Payment...</p>
        <span>Please wait, this may take a moment.</span>
    </div>
);

const SuccessIcon = () => (
    <svg className="status-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
    </svg>
);

const FailureIcon = () => (
    <svg className="status-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
    </svg>
);


const PaymentStatusPage = () => {
    const { merchantOrderId } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('LOADING'); 
    const [error, setError] = useState('');
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        if (!merchantOrderId) {
            setStatus('FAILED');
            setError("No order ID found in the URL.");
            return;
        }

        const interval = setInterval(() => {
            const checkStatus = async () => {
                try {
                    const response = await fetch(`${BACKEND_URL}/api/payment/status/${merchantOrderId}`);
                    
                    if (!response.ok) {
                        const errData = await response.json();
                        throw new Error(errData.message || "Could not verify payment.");
                    }

                    const data = await response.json();

                    if (data.success) {
                        if (data.status === 'COMPLETED') {
                            setStatus('SUCCESS');
                            setOrderDetails(data.order);
                            clearInterval(interval); 
                        } else if (data.status === 'FAILED') {
                            setStatus('FAILED');
                            setError(data.message || 'Payment failed or was cancelled.');
                            setOrderDetails(data.order);
                            clearInterval(interval); 
                        }
                    } else {
                        throw new Error(data.message || 'Failed to get payment status.');
                    }

                } catch (err) {
                    setStatus('FAILED');
                    setError(err.message);
                    clearInterval(interval); 
                }
            };
            checkStatus();
        }, 3000); 

        return () => clearInterval(interval);

    }, [merchantOrderId]);

    const renderStatus = () => {
        switch (status) {
            case 'LOADING':
                return <Loader />;
            case 'SUCCESS':
                return (
                    <div className="status-card success">
                        <SuccessIcon />
                        <h2>Payment Successful!</h2>
                        <p>Your order has been confirmed and will be processed shortly.</p>
                        <div className="order-details">
                            <strong>Order ID:</strong> <span>{orderDetails?.merchantOrderId}</span>
                        </div>
                        <button className="status-button" onClick={() => navigate('/orders')}>View My Orders</button>
                    </div>
                );
            case 'FAILED':
                return (
                    <div className="status-card failed">
                        <FailureIcon />
                        <h2>Payment Failed</h2>
                        <p className="error-message">{error}</p>
                        <div className="order-details">
                            <strong>Order ID:</strong> <span>{merchantOrderId}</span>
                        </div>
                        <button className="status-button" onClick={() => navigate('/checkout')}>Try Payment Again</button>
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <div className="status-page-container">
            {renderStatus()}
        </div>
    );
};

export default PaymentStatusPage;

