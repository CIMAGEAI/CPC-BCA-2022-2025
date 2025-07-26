import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMutation } from 'react-query';
import { 
  CreditCard, 
  Truck, 
  MapPin, 
  User, 
  Phone, 
  Mail,
  Lock,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import api from '../utils/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items: cart, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const [shippingDetails, setShippingDetails] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });

  const [paymentDetails, setPaymentDetails] = useState({
    transactionNumber: '',
    paymentSlip: null,
  });
  const [paymentSlipPreview, setPaymentSlipPreview] = useState(null);

  // Calculate totals
  const subtotal = (cart || []).reduce((sum, item) => {
    const price = item.selectedVariant?.price || item.price;
    return sum + (price * item.quantity);
  }, 0);

  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  // Create order mutation
  const createOrderMutation = useMutation(
    async (orderData) => {
      const response = await api.post('/orders', orderData);
      return response.data;
    },
    {
      onSuccess: (data) => {
        clearCart();
        navigate(`/orders/${data.data._id}`);
      }
    }
  );

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSlipChange = (e) => {
    const file = e.target.files[0];
    setPaymentDetails(prev => ({ ...prev, paymentSlip: file }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPaymentSlipPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPaymentSlipPreview(null);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // Create order data
      const orderData = {
        items: (cart || []).map(item => ({
          product: item.product._id,
          variant: item.variant,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity
        })),
        shippingAddress: {
          name: `${shippingDetails.firstName} ${shippingDetails.lastName}`,
          phone: shippingDetails.phone,
          street: shippingDetails.address,
          city: shippingDetails.city,
          state: shippingDetails.state,
          zipCode: shippingDetails.pincode,
          country: shippingDetails.country || 'India'
        },
        paymentMethod: 'bank_transfer',
        subtotal,
        shipping: {
          cost: shipping,
          method: 'standard',
          estimatedDays: 3
        },
        tax,
        total,
        payment: {
          transactionNumber: paymentDetails.transactionNumber || 'DEMO-' + Date.now(),
          paymentSlip: 'demo-slip.jpg',
        },
        status: 'pending_verification',
      };

      // Create order
      console.log('Creating order with data:', orderData);
      const response = await api.post('/orders', orderData);
      console.log('Order creation response:', response.data);
      
      if (response.data.success) {
        clearCart();
        alert('Your order is placed successfully!');
        navigate('/orders');
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Order creation failed:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (setter) => (e) => {
    setter(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Please add some items to your cart before proceeding to checkout.
          </p>
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>
    );
  }

  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Cart</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-orange-600 text-white' : 'bg-gray-200'
              }`}>
                {step > 1 ? <CheckCircle className="h-5 w-5" /> : '1'}
              </div>
              <span className="font-medium">Shipping</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-200"></div>
            <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-orange-600 text-white' : 'bg-gray-200'
              }`}>
                {step > 2 ? <CheckCircle className="h-5 w-5" /> : '2'}
              </div>
              <span className="font-medium">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <Truck className="h-6 w-6 text-orange-600" />
                  <h2 className="text-xl font-semibold text-gray-800">Shipping Information</h2>
                </div>

                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={shippingDetails.firstName}
                        onChange={handleInputChange(setShippingDetails)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={shippingDetails.lastName}
                        onChange={handleInputChange(setShippingDetails)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={shippingDetails.email}
                        onChange={handleInputChange(setShippingDetails)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={shippingDetails.phone}
                        onChange={handleInputChange(setShippingDetails)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <textarea
                      name="address"
                      value={shippingDetails.address}
                      onChange={handleInputChange(setShippingDetails)}
                      required
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingDetails.city}
                        onChange={handleInputChange(setShippingDetails)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={shippingDetails.state}
                        onChange={handleInputChange(setShippingDetails)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={shippingDetails.pincode}
                        onChange={handleInputChange(setShippingDetails)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                  >
                    Continue to Payment
                  </button>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <CreditCard className="h-6 w-6 text-orange-600" />
                  <h2 className="text-xl font-semibold text-gray-800">Payment via QR Code</h2>
                </div>
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <div className="flex flex-col items-center mb-6">
                    <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 w-48 h-48 flex items-center justify-center">
                      <img 
                        src="https://res.cloudinary.com/dfbbzshqt/image/upload/v1752032500/Screenshot_2025-07-09_090955_ssoap1.png" 
                        alt="Payment QR Code" 
                        className="w-40 h-40 object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="hidden flex-col items-center justify-center text-center text-gray-500">
                        <CreditCard className="h-12 w-12 mb-2" />
                        <p className="text-sm">QR Code Image</p>
                        <p className="text-xs">Please add your QR code image to /public/assets/qr-code.png</p>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-600 text-sm">Scan this QR code to pay ₹{total.toFixed(2)} using any UPI app.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Transaction/Reference Number *</label>
                    <input
                      type="text"
                      name="transactionNumber"
                      value={paymentDetails.transactionNumber}
                      onChange={e => setPaymentDetails(prev => ({ ...prev, transactionNumber: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Payment Slip *</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePaymentSlipChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    {paymentSlipPreview && (
                      <img src={paymentSlipPreview} alt="Payment Slip Preview" className="mt-2 w-40 h-40 object-contain border rounded-lg" />
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    onClick={handlePaymentSubmit}
                    className="w-full py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing...' : 'Confirm Order'}
                  </button>
                </form>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {(cart || []).map((item) => (
                  <div key={item._id + (item.selectedVariant?._id || '')} className="flex items-center space-x-3">
                    {/* <img
                      src={item.mainImage?.url || 'https://via.placeholder.com/60x60'}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    /> */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-800 truncate">
                        {item.name}
                      </h3>
                      {item.selectedVariant && (
                        <p className="text-xs text-gray-600">{item.selectedVariant.name}</p>
                      )}
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium text-gray-800">
                      ₹{((item.selectedVariant?.price || item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (GST 18%)</span>
                  <span className="font-medium">₹{tax.toFixed(2)}</span>
                </div>
                {paymentMethod === 'cod' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">COD Charge</span>
                    <span className="font-medium">₹50.00</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-800">Total</span>
                    <span className="text-lg font-bold text-orange-600">
                      ₹{(paymentMethod === 'cod' ? total + 50 : total).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 