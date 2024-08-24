import React, { useState,useEffect } from 'react';
// import axios from 'axios';

import './Signuppage.css';

import axiosInstance from '@axios';                                                                                     



const Signuppage = ({ setShowSignup }) => {
    const [fullname, setFullname] = useState('');
    const [contact, setContact] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');   
  
 
    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post('/Signup', {
                fullname,
                contact,
                email,
                password,
                deliveryAddress: {
                    addressLine1,
                    addressLine2,
                    city,
                    state,
                    postalCode,
                    country
                }  
            });

            if (response.status === 200) {
                console.log('Signup successful');
                setShowSignup(false);
                alert('Signup successful!');
             
            } else {
                console.error('Signup failed');
            }
        } catch (error) {
            console.error('Error during signup:', error.message);
        }
    };

    useEffect(() => {
        // Scroll to top when the component mounts or product changes
        window.scrollTo(0, 0);
    },);

    

    return (
        <div className="signup-container" style={{fontFamily:'Nunito'}}>
            <form onSubmit={handleSignup} className="signup-form">
                <h2>Create your Account</h2>
                <label>
                    <input
                        type="text"
                        placeholder="Your Fullname"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                    />
                </label>
                <label>
                    <input
                        type="number"
                        placeholder="Mobile Number"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                    />
                </label>
                <label>
                    <input
                        type="email"
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>
                <label>
                    <input
                        type="password"
                        placeholder="Your Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <label>
                    <input
                        type="text"
                        placeholder="Street and House Numner"
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                    />
                </label>
                <label>
                    <input
                        type="text"
                        placeholder="Area and Nearby Landmark"
                        value={addressLine2}
                        onChange={(e) => setAddressLine2(e.target.value)}
                    />
                </label>
                <label>
                    <input
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                </label>
                <label>
                    <input
                        type="text"
                        placeholder="State"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                    />
                </label>
                <label>
                    <input
                        type="text"
                        placeholder="Pincode"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                    />
                </label>
                <label>
                    <input
                        type="text"  
                        placeholder="Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    />
                </label>
                
                
                <button type="submit" className="submit" style={{marginTop:'10px'}}> Sign Up</button>
            </form>
        </div>
    );
};

export default Signuppage;
