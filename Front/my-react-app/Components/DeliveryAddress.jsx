import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DeliveryAddress.css';

import axiosInstance from '@axios';


const DeliveryAddress = ({ userId, onAddressChange }) => {
    const [address, setAddress] = useState({
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
    });
    const [userDetails, setUserDetails] = useState({ name: '', mobileNumber: '' });
    const [isEditing, setIsEditing] = useState(false);

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddress(prevAddress => ({
            ...prevAddress,
            [name]: value
        }));
        onAddressChange({ ...address, [name]: value });
    };

    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const response = await axiosInstance.post('/getDeliveryAddress', { userId });
                setAddress(response.data.deliveryAddress);
                onAddressChange(response.data.deliveryAddress); // Ensure the parent component has the initial address
            } catch (error) {
                console.error('Error fetching delivery address:', error);
                // Handle error
            }
        };

        const fetchUserDetails = async () => {
            try {
                const response = await axiosInstance.post('/getUserDetails', { userId });
                setUserDetails(response.data);
            } catch (error) {
                console.error('Error fetching user details:', error);
                // Handle error
            }
        };

        fetchAddress();
        fetchUserDetails();
    }, [userId, onAddressChange]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/updateDeliveryAddress', { userId, deliveryAddress: address });
            alert('Delivery address updated successfully');
            setIsEditing(false); // Close the form after successful update
        } catch (error) {
            console.error('Error updating delivery address:', error);
            // Handle error
        }
    };

    return (
        <div className={`custom-delivery-address ${isEditing ? 'editing' : ''}`}>
            {isEditing ? (
                <>
                    <h2>Update Delivery Address</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="custom-form-row">
                            <div className="custom-form-group">
                                <label>Street and House Numner</label>
                                <input type="text" name="addressLine1" value={address.addressLine1} onChange={handleAddressChange} required />
                            </div>
                            <div className="custom-form-group">
                                <label>Area and Nearby Landmark</label>
                                  <input type="text" name="addressLine2" value={address.addressLine2} onChange={handleAddressChange} />
                            </div>
                        </div>
                        <div className="custom-form-row">
                              <div className="custom-form-group">
                                <label>City:</label>
                                <input type="text" name="city" value={address.city} onChange={handleAddressChange} required />
                            </div>
                            <div className="custom-form-group">
                                <label>State:</label>
                                <input type="text" name="state" value={address.state} onChange={handleAddressChange} required />
                            </div>
                        </div>
                        <div className="custom-form-row">
                            <div className="custom-form-group">
                                <label>PinCode:</label>
                                <input type="text" name="postalCode" value={address.postalCode} onChange={handleAddressChange} required />
                            </div>
                            <div className="custom-form-group">
                                <label>Country:</label>
                                <input type="text" name="country" value={address.country} onChange={handleAddressChange} required />
                            </div>
                        </div>
                        <button type="submit" className="custom-save-button custom-button">Save</button>
                        <button type="button" onClick={() => setIsEditing(false)} className="custom-cancel-button custom-button">Cancel</button>
                    </form>
                </>
            ) : (
                <>
                    <h2>Delivery Address</h2>  
                    <div className="custom-address-display">
                        <div className="custom-address-details">
                            <span style={{color:'Black'}}>Deliver to: {userDetails.fullname}, {address.postalCode}</span>
                            <span >{address.addressLine1}, {address.addressLine2}, {address.city}</span>
                        </div>
                        <button style={{paddingTop:'7px',fontWeight:'bold'}} onClick={() => setIsEditing(true)} className="custom-update-button custom-button">Update</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default DeliveryAddress;
