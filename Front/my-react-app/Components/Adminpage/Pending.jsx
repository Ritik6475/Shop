import React from 'react'
import './Pending.css'
import Adminpage from './Adminpage'
import  { useEffect, useState } from 'react';
import axiosInstance from '@axios';



const Pending = () => {

  
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);



  useEffect(() => {
      const fetchTickets = async () => {
        try {
          const response = await axiosInstance.get('/getAllTickets');
          console.log('Tickets fetched:', response.data); // Debug log
          setTickets(response.data);
        } catch (error) {
          console.error('Error fetching tickets:', error.response ? error.response.data : error.message); // Log error details
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
  
    const handleRespondToTicket = async (ticketId) => {
      try {
        await axiosInstance.post('/updateTicket', { ticketId, status: 'resolved', adminResponse: responseText });
        setTickets(prevTickets =>
          prevTickets.map(ticket =>
            ticket._id === ticketId ? { ...ticket, status: 'resolved', adminResponse: responseText } : ticket
          )
        );
        setResponseText('');
        setSelectedTicket(null);
        alert('Response sent successfully');
      } catch (error) {
        console.error('Error responding to ticket:', error.response ? error.response.data : error.message); // Log error details
        alert('Failed to send response');
      }
    };
  
    if (loading) {
      return <div className='loading'>Loading...</div>;
    }
  
    if (error) {
      return <div className='error'>Error: {error}</div>;
    }




  return (
    <>
    <Adminpage/>


      




</>
  )
}

export default Pending