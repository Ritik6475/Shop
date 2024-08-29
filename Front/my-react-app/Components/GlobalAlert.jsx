import React, { useEffect } from 'react';
import './GlobalAlert.css';

const GlobalAlert = ({ message, type, onClose }) => {
  useEffect(() => {
    if (message) {
      console.log(`Displaying alert: ${message} of type: ${type}`); // Log message and type
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Automatically close after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [message, type, onClose]);

  if (!message) return null; 

  return (
    <div className={`global-alert ${type}`}>
      <span>{message}</span>
      <button className="close-btn" onClick={onClose}>×</button>
    </div>
  );
};

export default GlobalAlert;
