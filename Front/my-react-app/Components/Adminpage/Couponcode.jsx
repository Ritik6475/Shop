import React, { useState } from 'react';  
import axios from 'axios';
import './Couponcode.css';
import axiosInstance from '@axios';

const Couponcode = () => {
  const [couponCode, setCouponCode] = useState('');

  const generateCouponCode = () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    setCouponCode(code);

    // Save the coupon code to the database
    axiosInstance.post('/couponcode', { couponCode: code })
      .then(response => {
        console.log('Coupon code saved successfully:', response.data);
      })
      .catch(error => {
        console.error('Error saving coupon code:', error);
      });
  };

  return (
    <div className="couponcode-container">
      <h1>Generate Coupon Code</h1>
      <button onClick={generateCouponCode}>Generate Coupon Code</button>
      {couponCode && <p>Generated Coupon Code: {couponCode}</p>}
    </div>
  );
};

export default Couponcode;
