import React, { useState, useEffect } from 'react';
import './Newsletter.css';
import axiosInstance from '@axios'; // Ensure axiosInstance is correctly configured
import Adminpage from './Adminpage';

const Newsletter = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const response = await axiosInstance.get('/getSubscribers');
        // Reverse the array to show the newest subscribers first
        setSubscribers(response.data.reverse());
        setLoading(false);
      } catch (error) {
        console.error('Error fetching subscribers:', error);
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, []);

  const updateStatus = async (whatsappNumber, status) => {
    try {
      await axiosInstance.post('/updateSubscriberStatus', { whatsappNumber, addedToGroup: status });
      setSubscribers(prevSubscribers =>
        prevSubscribers.map(subscriber =>
          subscriber.whatsappNumber === whatsappNumber
            ? { ...subscriber, addedToGroup: status }
            : subscriber
        )
      );
    } catch (error) {
      console.error('Error updating subscriber status:', error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="newsletter-container">
      <div style={{ marginLeft: '-30px', marginTop: '-50px' }}>
        <Adminpage />
      </div>

      <h2>Newsletter Subscribers</h2>

      <table className="subscribers-table">
        <thead>
          <tr>
            <th>WhatsApp Number</th>
            <th>Status</th>
            <th>Mark as Added</th>
            <th>Mark as Not Added</th>
          </tr>
        </thead>
        <tbody>
          {subscribers.map(subscriber => (
            <tr key={subscriber.whatsappNumber}>
              <td>{subscriber.whatsappNumber}</td>
              <td>{subscriber.addedToGroup}</td>
              <td>
                <button
                  onClick={() => updateStatus(subscriber.whatsappNumber, 'yes')}
                  disabled={subscriber.addedToGroup === 'yes'}
                >
                  Added
                </button>
              </td>
              <td>
                <button
                  onClick={() => updateStatus(subscriber.whatsappNumber, 'no')}
                  disabled={subscriber.addedToGroup === 'no'}
                >
                  Not Added
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Newsletter;
