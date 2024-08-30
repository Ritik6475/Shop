import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import './Orderpage.css';
import Footer from '../Footer';
import axiosInstance from '@axios';

const Orderpage = ({ userId }) => {


  const [allOrders, setAllOrders] = useState([]);
  const [bundleOrders, setBundleOrders] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [canRaiseTicket, setCanRaiseTicket] = useState(true);
  const [feedbackData, setFeedbackData] = useState({});
  const [activeSection, setActiveSection] = useState('orders');
  const [showGoToTop, setShowGoToTop] = useState(false);
  
  
  useEffect(() => {
    const fetchOrdersAndTickets = async () => {
      try {
        const [allOrdersResponse, bundleOrdersResponse, ticketsResponse] = await Promise.all([
          axiosInstance.post('/getUserOrders', { userId }),
          axiosInstance.post('/getUserBundleOrders', { userId }),
          axiosInstance.post('/getUserTickets', { userId })
        ]);

        setAllOrders(allOrdersResponse.data.allOrders);
        setBundleOrders(bundleOrdersResponse.data.bundleOrders);
        setTickets(ticketsResponse.data);
      } catch (error) {
        console.error('Error fetching orders or tickets:', error);
        setError('Error fetching orders or tickets. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchOrdersAndTickets();
    }
  }, [userId]);


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };


  useEffect(() => {
    const ticketExists = tickets.some(ticket => ticket.orderId === selectedOrderId);
    setCanRaiseTicket(!ticketExists || tickets.every(ticket => ticket.status === 'resolved'));
  }, [tickets, selectedOrderId]);

  function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  
  const handleRaiseTicket = async () => {
    try {
      await axiosInstance.post('/createTicket', { userId, orderId: selectedOrderId, subject, description });
      alert('Ticket raised successfully');
      setSubject('');
      setDescription('');
      setSelectedOrderId('');
      const updatedTickets = await axiosInstance.post('/getUserTickets', { userId });
      setTickets(updatedTickets.data);
    } catch (error) {
      console.error('Error raising ticket:', error);
      alert(`Failed to raise ticket: ${error.response?.data?.message || error.message}`);
    }
  };
  const renderOrderStatus = (status, statusChangeDate, deliveryAddress, date) => {
    switch (status) {
      case 'completed':
        return (
          <>
            Delivered on -- {formatDate(statusChangeDate)} at {deliveryAddress && renderDeliveryAddress(deliveryAddress)}
          </>
        );
      case 'pending':
        return (
          <>
            Order will be delivered before {formatDate(addDays(new Date(date), 7))} at {deliveryAddress && renderDeliveryAddress(deliveryAddress)}
          </>
        );
      case 'returned':
        return <>Order returned on {formatDate(statusChangeDate)}</>;
      case 'cancelled':
        return <>Order cancelled on {formatDate(statusChangeDate)}</>;
      default:
        return status;
    }
  };
  

  const handleFeedbackSubmit = async (orderId) => {
    const { rating, feedback, feedbackImage } = feedbackData[orderId] || {};

    const formData = new FormData();
    formData.append('orderId', orderId);
    formData.append('rating', rating);
    formData.append('feedback', feedback);
    if (feedbackImage) {
      formData.append('image', feedbackImage);
    }

    try {
      await axiosInstance.post('/submitFeedback', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Feedback submitted successfully');
      setFeedbackData(prevState => ({
        ...prevState,
        [orderId]: { rating: 0, feedback: '', feedbackImage: null, visible: false }
      }));
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert(`Failed to submit feedback: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleInputChange = (orderId, field, value) => {
    setFeedbackData(prevState => ({
      ...prevState,
      [orderId]: {
        ...prevState[orderId],
        [field]: value
      }
    }));
  };


  const toggleFeedbackVisibility = (orderId) => {
    setFeedbackData(prevState => ({
      ...prevState,
      [orderId]: {
        ...prevState[orderId],
        visible: !prevState[orderId]?.visible
      }
    }));
  };

  const handleImageChange = (orderId, file) => {
    setFeedbackData(prevState => ({
      ...prevState,
      [orderId]: {
        ...prevState[orderId],
        feedbackImage: file
      }
    }));
  };

  const handleRatingChange = (orderId, rating) => {
    setFeedbackData(prevState => ({
      ...prevState,
      [orderId]: {
        ...prevState[orderId],
        rating: rating
      }
    }));
  };
  
  const renderStars = (orderId, rating) => {
    const stars = [];
  
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className="star"
          size={24}
          onClick={() => handleRatingChange(orderId, i)}
          style={{ 
            color: i <= rating ? '#ff6f00' : '#ccc', // Highlight stars that are less than or equal to the current rating
            cursor: 'pointer',
            transition: 'color 0.2s ease'
          }}
        />
      );
    }
  
    return stars;
  };
  
  if (loading) {
    return <div className='loading'>Loading...</div>;
  }

  if (error) {
    return <div className='error'>Error: {error}</div>;
  }

  const renderDeliveryAddress = (address) => {
    return `${address.addressLine1}, ${address.city}, ${address.state}  `;
  };












  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  
  return (
    <div className='order-page'>
      <h1 className='order-heading' style={{fontFamily:'Nunito', color:'white',marginTop:'20px'}}>Your Orders</h1>
      <div className='toggle-buttons'>
  <button className={`toggle-btn ${activeSection === 'ticket' ? 'active' : ''}`} 
    onClick={() => {
      setActiveSection('ticket');
      window.scrollBy({ top: 1000, behavior: 'smooth' });
    }}>Raise Ticket</button>

  <button className={`toggle-btn ${activeSection === 'singleOrders' ? 'active' : ''}`} 
    onClick={() => {
      setActiveSection('singleOrders');
      window.scrollBy({ top: 1000, behavior: 'smooth' });
    }}>Your Single Orders</button>

  <button className={`toggle-btn ${activeSection === 'bundleOrders' ? 'active' : ''}`} 
    onClick={() => {
      setActiveSection('bundleOrders');
      window.scrollBy({ top: 1000, behavior: 'smooth' });
    }}>Your Multi Orders</button>

  <button className={`toggle-btn ${activeSection === 'tickets' ? 'active' : ''}`} 
    onClick={() => {  
      setActiveSection('tickets');
      window.scrollBy({ top: 1000, behavior: 'smooth' });
    }}>Your Previous Tickets</button>
</div>  

    
    
      <div class="notification-banner">
    <div class="notification-content">
        <h2 class="notification-title">Need Help? Raise a Ticket Now!</h2>
        <p class="notification-text">If you have any complaints regarding your order, payment, product, or delivery, don’t worry—we're here to help! Raise a ticket, and we'll address your issue within 2 days.</p>
        <p class="notification-highlight">How to Raise a Ticket:</p>
        <p class="notification-text">If you have any complaints regarding your order, payment, product, or delivery, you can easily raise a ticket. We are committed to resolving your issue within 2 days. Let us know, and we will take care of it!</p>
        <p class="notification-text-bold">Simply raise a ticket by providing your Order ID or Product ID, selecting your issue type, and describing the problem. We've got you covered!</p>

        <ul class="notification-steps">
            <li>📦 <strong>Order ID:</strong> Click on a single order and then with each of your order u will find the Order ID. You can raise a ticket with that Order ID.</li>
            <li>🛍️ <strong>Bundle Order:</strong> Click on your bundle order to find both the Order ID here with each product u will find the product ID as well . Use both IDs to describe your issue when raising a ticket. use product id in the description and write the issue</li>
        </ul>
        <p class="notification-extra">Need assistance right away? Call our customer care at <strong>@8435541370</strong> for immediate support.</p>
        <a href="#" class="notification-button" onClick={() => setActiveSection('ticket')}>Raise a Ticket Now</a>

        <div class="faq-section">
            <h3>Common Issues We Help With:</h3>
            <ul>
                <li>🔄 Return Issues</li>
                <li>💳 Payment Problems</li>
                <li>🛠️ Product Concerns</li>
                <li>🚚 Shipping & Delivery Issues</li>
            </ul>
        </div>
        <p class="notification-footer">You can also view your previous tickets in the <strong>Previous Ticket Section</strong>.</p>
    </div>
</div>

      {activeSection === 'ticket' && (
        <div className='ticket-section'>
          <h2>Raise a Ticket</h2>
          <input
            type='text'
            placeholder='Order ID'
            value={selectedOrderId}
            onChange={(e) => setSelectedOrderId(e.target.value)}
          />
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={!canRaiseTicket}
          >
            <option value=''>Select a problem type</option>
            <option value='Return'>Return</option>
            <option value='Product Issue'>Product Issue</option>
            <option value='Shipping Delay'>Shipping Delay</option>
            <option value='Payment Issue'>Payment Issue</option>
            <option value='Other'>Other</option>
          </select>
          <textarea
            placeholder='Description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={!canRaiseTicket}
          />
          <button onClick={handleRaiseTicket} disabled={!canRaiseTicket}>
            Submit Ticket
          </button>

          {!canRaiseTicket && <p className='error-message'>You have unresolved tickets for the selected order. Please resolve them before raising a new one.</p>}
       
       <br /><br /> <  hr />
        <div style={{marginTop:'100px'}}>
          <Footer/>
          </div>
        </div>
      )}
  


{activeSection === 'singleOrders' && (
  <div className='section'>
    <h2>Single Orders</h2>
    <div className='flipkart-order-container'>
      {allOrders.map(order => (
        <div key={order._id}  className='flipkart-order-item'>
          <div className='flipkart-order-details'>
            <div className='flipkart-order-img'>
           
              {/* {<img src={`/api${order.image}`} alt={order.productName} />
            }
            */}
          
           { <img src={`${import.meta.env.VITE_API_BASE_URL}${order.image}`} alt={order.productName} />
        }

{/* 
<img src={`${import.meta.env.VITE_API_BASE_URL}/uploads/images/${order.image}`} alt={order.productName} /> */}


            </div>
            <div className='flipkart-order-info'>
              <p className='flipkart-order-product-name'>{order.productName}</p>
              <p className='flipkart-order-color'>Color: {order.color}</p>
              <p className='flipkart-order-size'>Size: {order.size}</p>
              <p className='flipkart-order-size'>Item Price: {order.price/order.quantity}</p>
              
              <p className='flipkart-order-quantity'>Quantity: {order.quantity}</p>
              <p className='flipkart-order-price'>Order Date: {formatDate(order.date)}</p>
             
              <p className='flipkart-order-price'>Order ID: {(order._id)}</p>
             
            </div>
            <div className='flipkart-order-price-section'>
              <p className='flipkart-order-price' style={{color:'black',fontSize:'14.5px',marginTop:'-25px'}}>Total Price: ₹{order.price}</p>
            </div>

            <div className='flipkart-order-extra'>
              <div className={`flipkart-order-status-dot ${order.status}`} style={{marginTop:'5px'}}/>
              {order.status === 'completed' && (
                <>
                  <p className='flipkart-order-delivery-info'>
                    Delivered on- -
              
                   {formatDate( order.statusChangeDate)} at <br /> <p style={{color:'gray',marginTop:'5px',marginLeft:'-21px'}}>{order.deliveryAddress && renderDeliveryAddress(order.deliveryAddress)}</p>
              
                  </p>
                  <button className='flipkart-feedback-btn' onClick={() => toggleFeedbackVisibility(order._id)}>
  {feedbackData[order._id]?.visible ? 'Hide Feedback' : '★ Rate & Review'}
</button>
{feedbackData[order._id]?.visible && (
  <div className='flipkart-feedback-form'>
    <div className='flipkart-feedback-stars'>
      {renderStars(order._id, feedbackData[order._id]?.rating || 0)}
    </div>
    <textarea
      placeholder='Write your Review'
      value={feedbackData[order._id]?.feedback || ''}
      onChange={(e) => handleInputChange(order._id, 'feedback', e.target.value)}
    />
    <input type='file' onChange={(e) => handleImageChange(order._id, e.target.files[0])} />
    <button   style={{backgroundColor:'black'}}  onClick={() => handleFeedbackSubmit(order._id) }>Submit Feedback</button>
  </div>
)}
                </>
              )}
              {order.status === 'pending' && (
                <p className='flipkart-order-delivery-info' >
               
                  Order will be delivered before {formatDate(addDays(new Date(order.date), 7))} at<p style={{color:'gray',marginTop:'5px',marginLeft:'-21px'}}>{order.deliveryAddress && renderDeliveryAddress(order.deliveryAddress)}</p>
               
                </p>
              )}
              {order.status === 'returned' && (
                <p className='flipkart-order-delivery-info' style={{marginLeft:'100px'}}>
                  Order returned on {formatDate(order.statusChangeDate)}
                </p>
              )}
              {order.status === 'cancelled' && (
                <p className='flipkart-order-delivery-info'>
                  Order cancelled on {formatDate(order.statusChangeDate)}
                </p>
              )}
              {order.returnRequest && (
                <p className='flipkart-order-return-request'>Return Requested</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
    {showGoToTop && (
        <button className='' onClick={handleScrollToTop}>
          Go to Top
        </button>
      )}

    <Footer/>
  </div>
)}

{activeSection === 'bundleOrders' && (
  <div className='section'>
    <h2>Bundle Orders</h2>
    <div className='flipkart-order-container'>
      {bundleOrders.map(bundle => (
        <div key={bundle._id} className='flipkart-order-item'>
          <div className='flipkart-order-details'>
            <div className='flipkart-order-info'>
              <p className='flipkart-order-product-name'>Order ID: {bundle._id}</p>
              <p className='flipkart-order-price'>Total Amount: ₹{bundle.totalAmount}</p>
              <p className='flipkart-order-price'>Order Date: {formatDate(bundle.date)}</p>
              <p className={`flipkart-order-status ${bundle.status}`} style={{marginTop:'-70px',marginLeft:'1010px'}}>
              
              
                {bundle.status === 'pending' ? (
                  <>
                  <p style={{marginLeft:'30px'}}> Order will be delivered before {formatDate(addDays(new Date(bundle.date), 7))} at </p>
                    <br />


                    <p style={{color:'gray',marginTop:'-10px',marginLeft:'28px'}}>{bundle.deliveryAddress && renderDeliveryAddress(bundle.deliveryAddress)}</p>
                 


                  </>
                ) : bundle.status === 'completed' ? (
                  <>
                    Delivered on - {formatDate(bundle.statusChangeDate)} at <p style={{color:'gray',marginTop:'5px',marginLeft:'-2px'}}>{bundle.deliveryAddress && renderDeliveryAddress(bundle.deliveryAddress)}</p>
                 
                  </>
                ) : bundle.status === 'returned' ? (
                  <>
                    Order returned on {formatDate(bundle.statusChangeDate)}
                  </>
                ) : bundle.status === 'cancelled' ? (
                  <>
                <p style={{marginLeft:"0px"}}>    Order cancelled on {formatDate(bundle.statusChangeDate)}</p>

                  </>
                ) : (
                  bundle.status
                )}
              </p>
            </div>
            
          </div>  

          <div className='flipkart-order-products' style={{ marginTop: '40px' }}>
            {bundle.products.map(product => (
              <div key={product._id} className='flipkart-order-item'>
                <div className='flipkart-order-details'>
                  <div className='flipkart-order-img'>
                  
                    {/* { <img src={`/api${product.image}`} alt={product.productName} />
               
               } */}

              
                    {<img src={`${import.meta.env.VITE_API_BASE_URL}${product.image}`} alt={product.productname} />
                   }
                  
                  
                  {/* {<img src={`${import.meta.env.VITE_API_BASE_URL}/uploads/images/${product.image}`} alt={order.productName} />} */}


                  </div>
                  <div className='flipkart-order-info'>
                    <p className='flipkart-order-product-name'>{product.productName}</p>
                    <p className='flipkart-order-color'>Color: {product.color}</p>
                    <p className='flipkart-order-size'>Size: {product.size}</p>
                    <p className='flipkart-order-quantity'>Quantity: {product.quantity}</p>
                    <p className='flipkart-order-price'>Price per piece: ₹{product.price}</p>
                    <p className='flipkart-order-price' >Total Price: ₹{product.price * product.quantity}</p>
                    
                    <p className='flipkart-order-price'>Product id: {product.productId}</p>

                  </div>
                  <div className='flipkart-order-extra'>
                    <div  style={{marginLeft:'275px'}} className={`flipkart-order-status-dot ${bundle.status}`} ><p style={{marginLeft:'25px',marginTop:'-5px'}}>{bundle.status}</p></div>
                    
                    {bundle.status === 'completed' && (
                      <>
                        <div className='flipkart-order-delivered' style={{marginLeft:'00px'}}>
                        </div>

                        <button style={{marginLeft:'200px'}} className='flipkart-feedback-btn' onClick={() => toggleFeedbackVisibility(product.productId)}>
                          
                          {feedbackData[product.productId]?.visible ? 'Hide Feedback' : '★ Rate & Review'}

                        </button>
                        {feedbackData[product.productId]?.visible && (
                          <div className='flipkart-feedback-form' style={{marginLeft:'270px'}}>
                            <div className='flipkart-feedback-stars'>
                              {renderStars(product.productId, feedbackData[product.productId]?.rating || 0)}
                            </div>
                            <textarea
                              placeholder='Write your Review'
                              value={feedbackData[product.productId]?.feedback || ''}
                              onChange={(e) => handleInputChange(product.productId, 'feedback', e.target.value)}
                            />
                            <input type='file' onChange={(e) => handleImageChange(product.productId, e.target.files[0])} />
                            <button onClick={() => handleFeedbackSubmit(product.productId)} style={{backgroundColor:'black'}}>Submit Feedback</button>
                          </div>
                        )}
                      </>
                    )}
                    {product.returnRequest && <p className='flipkart-order-return-request'>Return Requested</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
    {showGoToTop && (
        <button className='Gototop' onClick={handleScrollToTop}>
          Go to Top
        </button>
      )}

    <Footer/>

  </div>
)}




      {activeSection === 'tickets' && (
        <div className='section'>
          <h2>User Previous Tickets</h2>
          <div className='ticket-container'>
            {tickets.map(ticket => (
              <div key={ticket._id} className='ticket-item'>
                <p className='ticket-id'>Ticket ID: {ticket._id}</p>
                <p className='order-id'>Order ID: {ticket.orderId}</p>
                <p className='ticket-subject'>Subject: {ticket.subject}</p>
                <p className='ticket-description'>Description: {ticket.description}</p>
                <p className={`ticket-status ${ticket.status}`}>
                  Status: {ticket.status}
                </p>
                {ticket.adminResponse && (
                  <p className='admin-response'>Admin Response: {ticket.adminResponse}</p>
                )}
              </div>
            ))}
          </div>
          {showGoToTop && (
        <button className='Gototop' onClick={handleScrollToTop}>
          Go to Top
        </button>
      )}

          <Footer/>

        </div>
      )}
    </div>
  );
};

export default Orderpage;
