import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '@axios';
import './TrackOrder.css';
import Footer from './Footer';
import moment from 'moment';

const TrackOrder = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [isBundleOrder, setIsBundleOrder] = useState(false);

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const response = await axiosInstance.get(`/order/${orderId}`);
                setOrder(response.data);
                setIsBundleOrder(false);
            } catch (error) {
                try {
                    const bundleResponse = await axiosInstance.get(`/bundle-order/${orderId}`);
                    setOrder(bundleResponse.data);
                    setIsBundleOrder(true);
                } catch (bundleError) {
                    console.error('Failed to fetch bundle order', bundleError);
                }
            }
        };
        fetchOrderData();
    }, [orderId]);

    const getRandomTime = () => {
        const hours = Math.floor(Math.random() * 12) + 1; // Random hour between 1-12
        const minutes = Math.floor(Math.random() * 60); // Random minutes between 0-59
        const period = Math.random() > 0.5 ? 'am' : 'pm'; // Random am/pm
        return `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${period}`;
    };

    if (!order) return <div className="loading">Loading...</div>;

    // Use the actual order date, not the current date
    const orderDate = moment(order.date); // This should be the actual order date
    const packedDate = orderDate.clone().add(1, 'days');
    const shippedDate = orderDate.clone().add(2, 'days');
    const deliveryDate = order.status === 'completed'
        ? moment(order.statusChangeDate) // Use the statusChangeDate if completed
        : orderDate.clone().add(7, 'days'); // Expected delivery date if not yet completed

    const currentDate = moment(); // Current date

    // Check if dates are in the past or future
    const isPackedPast = currentDate.isAfter(packedDate);
    const isShippedPast = currentDate.isAfter(shippedDate);
    const isDelivered = order.status === 'completed';

    return (
        <div className="order-tracking-container">
            <div className="order-header">
                <h1>Track Your {isBundleOrder ? 'Bundle' : 'Single'} Order</h1>
            </div>

            {/* Order Summary */}
            <div className="order-summary">
                <h2>Order Details</h2>
                <div className="order-summary-item"><strong>Order ID:</strong> {orderId}</div>
                <div className="order-summary-item"><strong>Order Date:</strong> {orderDate.format('ddd, Do MMM \'YY')}</div>
                <div className="order-summary-item"><strong>Status:</strong> {order.status}</div>
                <div className="order-summary-item"><strong>Total Amount:</strong> ₹{order.totalAmount || order.price}</div>
                <div className="order-summary-item"><strong>Delivery Address:</strong> {order.deliveryAddress?.addressLine1}, {order.deliveryAddress?.city}, {order.deliveryAddress?.state}, {order.deliveryAddress?.postalCode}, {order.deliveryAddress?.country}</div>
            </div>

            {/* Delivery Progress */}
            <div className="delivery-progress-container">
                <h2>Delivery Progress</h2>
                <div className="progress-wrapper">
                    <div className="progress-line" style={{ height: isDelivered ? '100%' : isShippedPast ? '75%' : isPackedPast ? '50%' : '25%' }}></div>

                    <div className="progress-step">
                        <div className={`progress-dot ${orderDate.isSameOrBefore(currentDate) ? 'active' : ''}`}></div>
                        <div className="progress-content">
                            <p><strong>Ordered</strong></p>
                            <p>{orderDate.format('ddd, Do MMM \'YY')} - {getRandomTime()}</p>
                            <p>Your Order has been placed.</p>
                        </div>
                    </div>

                    <div className="progress-step">
                        <div className={`progress-dot ${isPackedPast ? 'active' : 'pending'}`}></div>
                        <div className="progress-content">
                            <p><strong>{isPackedPast ? 'Packed' : 'Expected Packing'}</strong></p>
                            <p>{packedDate.format('ddd, Do MMM \'YY')} - {getRandomTime()}</p>
                            <p>{isPackedPast ? 'Seller has processed your order.' : 'Expected packing.'}</p>
                        </div>
                    </div>

                    <div className="progress-step">
                        <div className={`progress-dot ${isShippedPast ? 'active' : 'pending'}`}></div>
                        <div className="progress-content">
                            <p><strong>{isShippedPast ? 'Shipped' : 'Expected Shipping'}</strong></p>
                            <p>{shippedDate.format('ddd, Do MMM \'YY')} - {getRandomTime()}</p>
                            <p>{isShippedPast ? 'Your item has been shipped.' : 'Expected shipping.'}</p>
                        </div>
                    </div>

                    <div className="progress-step">
                        <div className={`progress-dot ${isDelivered ? 'active' : 'pending'}`}></div>
                        <div className="progress-content">
                            <p><strong>{isDelivered ? 'Delivered' : 'Expected Delivery'}</strong></p>
                            <p>{deliveryDate.format('ddd, Do MMM \'YY')} - {getRandomTime()}</p>
                            <p>{isDelivered ? 'Your item has been delivered.' : 'Shipment yet to be delivered.'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default TrackOrder;
