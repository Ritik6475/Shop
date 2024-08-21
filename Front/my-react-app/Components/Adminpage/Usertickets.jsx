import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Usertickets.css';
import Adminpage from './Adminpage';
import axiosInstance from '@axios';

const Usertickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [status, setStatus] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axiosInstance.get('/getAllTickets');
        console.log('Tickets fetched:', response.data);
        setTickets(response.data);
      } catch (error) {
        console.error('Error fetching tickets:', error.response ? error.response.data : error.message);
        setError('Error fetching tickets. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleResponseChange = (event) => {
    setResponseText(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleRespondToTicket = async (orderId) => {
    try {
      await axiosInstance.post('/updateTicket', { orderId, status, adminResponse: responseText });
      setTickets(prevTickets =>
        prevTickets.map(ticket =>
          ticket.orderId === orderId ? { ...ticket, status, adminResponse: responseText } : ticket
        )
      );
      setResponseText('');
      setSelectedOrderId(null);
      alert('Response sent successfully');
    } catch (error) {
      console.error('Error responding to ticket:', error.response ? error.response.data : error.message);
      alert('Failed to send response');
    }
  };

  return (

    <div className='user-tickets'>
            <Adminpage />

      <h1 className='tickets-heading'>User Tickets</h1>
      {loading && <div className='loading'>Loading...</div>}
      {error && <div className='error'>Error: {error}</div>}
      <div className='tickets-container'>
        {tickets.length === 0 ? (
          <p>No tickets available</p>
        ) : (
          tickets.map(ticket => (
            <div key={ticket._id} className='ticket-item'>
              <p className='ticket-order-id'><strong>Order ID:</strong> {ticket.orderId}</p>
              <p><strong>Subject:</strong> {ticket.subject}</p>
              <p><strong>Description:</strong> {ticket.description}</p>
              <p className='ticket-status'><strong>Status:</strong> {ticket.status}</p>
              <p className='ticket-response'><strong>Admin Response:</strong> {ticket.adminResponse || 'No response yet'}</p>
              {selectedOrderId !== ticket.orderId ? (
                <button className='respond-button' onClick={() => setSelectedOrderId(ticket.orderId)}>Respond</button>
              ) : (
                <div className='response-form'>
                  <textarea
                    placeholder='Enter your response here...'
                    value={responseText}
                    onChange={handleResponseChange}
                  />
                 <select value={status} onChange={handleStatusChange}>
  <option value=''>Select status</option>
  <option value='pending'>Pending</option>
  <option value='solved'>Solved</option>
</select>

                  <button className='submit-response-button' onClick={() => handleRespondToTicket(ticket.orderId)}>
                    Submit Response
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Usertickets;
