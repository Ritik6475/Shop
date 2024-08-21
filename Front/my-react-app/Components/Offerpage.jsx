import React, { useState } from 'react';

const Offerpage = ({ applyCoupon }) => {
    const [couponCode, setCouponCode] = useState('');

    const handleApplyCoupon = () => {
        if (couponCode.trim() === '') {
            alert('Please enter a coupon code.');
            return;
        }
        applyCoupon(couponCode);
    };

    return (
        <div className="coupon-container">
            <div className="coupon-input-section">
                <img src="https://cdn-icons-png.flaticon.com/512/590/590461.png" alt="Coupon Icon" className="coupon-icon" />
                <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="coupon-input"
                />
                <button onClick={handleApplyCoupon} className="apply-coupon-button">Apply Coupon</button>
            </div>
        </div>
    );
};

export default Offerpage;
