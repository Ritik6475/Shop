import React, { useState, useEffect } from 'react';
import axiosInstance from '@axios';
import './Allorders.css';
import Adminpage from './Adminpage';

const Allorders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [bundleOrders, setBundleOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSingleOrderView, setIsSingleOrderView] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [allOrdersResponse, bundleOrdersResponse] = await Promise.all([
          axiosInstance.get('/getAllOrders'),
          axiosInstance.get('/getAllBundleOrders')
        ]);

        setAllOrders(allOrdersResponse.data.allOrders);
        setBundleOrders(bundleOrdersResponse.data.bundleOrders);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const updateOrderStatus = async (orderId, userId, status, isBundle = false) => {
    try {
      const endpoint = isBundle ? '/updateBundleOrderStatus' : '/updateOrderStatus';
      await axiosInstance.post(endpoint, { orderId, userId, status });

      if (isBundle) {
        setBundleOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId ? { ...order, status } : order
          )
        );
      } else {
        setAllOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId ? { ...order, status } : order
          )
        );
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Error updating order status. Please try again later.');
    }
  };

  const cancelOrder = async (orderId, userId, isBundle = false) => {
    await updateOrderStatus(orderId, userId, 'cancelled', isBundle);
  };

  const returnOrder = async (orderId, userId, isBundle = false) => {
    await updateOrderStatus(orderId, userId, 'returned', isBundle);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
  
    <div className="all-orders-container">
          
          <div style={{marginLeft:'-200px',marginTop:'0px'}}> <Adminpage />
          </div>

      <h1 className="page-title">All Orders</h1>

      <div className="order-toggle-buttons">
        <button
          className={`toggle-btn ${isSingleOrderView ? 'active' : ''}`}
          onClick={() => setIsSingleOrderView(true)} style={{backgroundColor:'black'}}
        >
          Single Orders
        </button>


        <button style={{marginLeft:'900px' ,marginTop:'-35px',backgroundColor:'purple'}}
          className={`toggle-btn ${!isSingleOrderView ? 'active' : ''}` }
          onClick={() => setIsSingleOrderView(false)}
        >
          Bundle Orders
        </button>
      </div>

      {isSingleOrderView ? (
        <div className="order-section">
          <h2 style={{marginBottom:'30px'}}>Single Orders</h2>
          {allOrders.map(order => (
            <div key={order._id} className="order-item">
              <div className="order-header">
                <p>User: {order.userName}</p>
                <p>Email: {order.useremail}</p>
                <p>Mobile: {order.usernumber}</p>
                <p>Status: {order.status}</p>
              </div>
              <div className="order-details">
                <p>Product ID: {order.productId}</p>
                <p>Product Name: {order.productName}</p>
                <p>Quantity: {order.quantity}</p>
                <p>Size: {order.size}</p>
                <p>Color: {order.color}</p>
                <p>Price: ₹{order.price}</p>
                <p>Delivery Address:</p>
                <address>
                  {order.deliveryAddress.addressLine1}<br />
                  {order.deliveryAddress.city}, {order.deliveryAddress.state}<br />
                  {order.deliveryAddress.country}, {order.deliveryAddress.postalCode}
                </address>
              </div>
              <div className="order-actions">
                {order.status !== 'cancelled' && (
                  <button onClick={() => cancelOrder(order._id, order.userId)}>Mark as Cancelled</button>
                )}
                {order.status !== 'returned' && (
                  <button onClick={() => returnOrder(order._id, order.userId)}>Mark as Returned</button>
                )}
                <button onClick={() => updateOrderStatus(order._id, order.userId, 'completed')}>Mark as Completed</button>
                <button onClick={() => updateOrderStatus(order._id, order.userId, 'pending')}>Mark as Pending</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="order-section">
          <h2>Bundle Orders</h2>
          {bundleOrders.map(order => (
            <div key={order._id} className="bundle-order-item">
              <div className="order-header">
                <p>User: {order.userName}</p>
                <p>Email: {order.useremail}</p>
                <p>Mobile: {order.usernumber}</p>
                <p>Status: {order.status}</p>
                <p>OrderID: {order._id}</p>
              </div>
              <div className="order-details">
                <p>Total Amount: ₹{order.totalAmount}</p>
                <p>Quantity: {order.products.reduce((total, product) => total + product.quantity, 0)}</p>
                <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                <p>Delivery Address:</p>
                <address>
                  {order.deliveryAddress.addressLine1}<br />
                  {order.deliveryAddress.city}, {order.deliveryAddress.state}<br />
                  {order.deliveryAddress.country}, {order.deliveryAddress.postalCode}
                </address>
              </div>
              <div className="bundle-products">
                <h3>Products in Bundle</h3>
                {order.products.map(product => (
                  <div key={product.productId} className="bundle-product-item">
                    <p>Product ID: {product.productId}</p>
                    <p>Product Name: {product.productName}</p>
                    <p>Quantity: {product.quantity}</p>
                    <p>Size: {product.size}</p>
                    <p>Color: {product.color}</p>
                    <p>Price: ₹{product.price}</p>
                  </div>
                ))}
              </div>
              <div className="order-actions">
                {order.status !== 'cancelled' && (
                  <button onClick={() => cancelOrder(order._id, order.userId, true)}>Mark as Cancelled</button>
                )}
                {order.status !== 'returned' && (
                  <button onClick={() => returnOrder(order._id, order.userId, true)}>Mark as Returned</button>
                )}
                <button onClick={() => updateOrderStatus(order._id, order.userId, 'completed', true)}>Mark as Completed</button>
                <button onClick={() => updateOrderStatus(order._id, order.userId, 'pending', true)}>Mark as Pending</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Allorders;
