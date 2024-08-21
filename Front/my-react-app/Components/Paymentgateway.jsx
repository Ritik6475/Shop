import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Paymentgateway.css';
import axiosInstance from '@axios';

const Paymentgateway = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { amount, productId, userId, bundleOrderId, size, deliveryAddress, color, quantity } = location.state || {};

  useEffect(() => {
    const initiatePayment = async (amount, productId, bundleOrderId) => {
      try {
        const response = await axiosInstance.post('/createOrder', { amount });
        const { id: order_id, currency } = response.data;

        const options = {
          key: 'rzp_test_PDH8JokGIvkPbl',
          amount: amount * 100,
          currency,
          order_id,
          name: 'Sanwariya Sarees',
          description: productId ? `Buying product with ID: ${productId} and Size: ${size}` : 'Cart checkout',
          handler: async function (response) {
            try {
              if (productId) {
                await axiosInstance.post('/saveOrder', { userId, productId, amount, size, deliveryAddress, color, quantity });
              } else if (bundleOrderId) {
                await axiosInstance.post('/updateBundleOrderStatus', { userId, bundleOrderId, status: 'paid', deliveryAddress });
              }
              alert(`Payment successful. Payment ID: ${response.razorpay_payment_id}`);
              navigate('/yourorder', { state: { userId } });
            } catch (error) {
              console.error('Error saving order:', error);
              alert(`Error saving order: ${error.message}`);
            }
          },
          prefill: {
            name: 'Your Name',
            email: 'youremail@example.com',
            contact: '9999999999'
          },
          notes: {
            address: deliveryAddress
          },
          theme: {
            color: '#F37254'
          }
        };

        if (window.Razorpay) {
          const rzp1 = new window.Razorpay(options);
          rzp1.open();
        } else {
          alert('Razorpay SDK is not loaded. Please try again.');
        }
      } catch (error) {
        console.error('Error initiating payment:', error);
        alert(`Error initiating payment: ${error.message}`);
      }
    };

    if (amount && userId) {
      initiatePayment(amount, productId, bundleOrderId);
    } else {
      console.error('Payment amount, user ID, or product ID is missing.');
      alert('Payment amount, user ID, or product ID is missing.');
    }
  }, [amount, productId, userId, bundleOrderId, size, deliveryAddress, color, quantity, navigate]);

  return (
    <div className='payment-gateway'>
      <h1>Processing Payment...</h1>
    </div>
  );
};

export default Paymentgateway;
