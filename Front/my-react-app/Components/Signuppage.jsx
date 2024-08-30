import React, { useState, useEffect } from 'react';
import './Signuppage.css';
import { FaUser, FaPhoneAlt, FaEnvelope, FaLock, FaMapMarkerAlt, FaCity, FaFlag, FaGlobe } from 'react-icons/fa';
import { RiLockPasswordFill } from 'react-icons/ri';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css'; 
import axiosInstance from '@axios';



const Signuppage = ({ setShowSignup }) => {
    const [fullname, setFullname] = useState('');
    const [contact, setContact] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }

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
                    country,
                },
            });

            if (response.status >= 200 && response.status < 300) {
                toast.success('Signup successful!');
                setTimeout(() => {
                    setShowSignup(false); // Switch back to the login view
                }, 3000); // Delay of 3 seconds before showing the login page
            } else {
                toast.error('Signup failed');
            }
        } catch (error) {
            console.error('Error during signup:', error.message);
            toast.error('Signup failed: ' + error.message);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);


    return (
        <div className="signup-container" style={{ fontFamily: 'Nunito' }}>
            <ToastContainer />
            <form onSubmit={handleSignup} className="signup-form">
                <h2>Create your Account</h2>

                {/* Fullname */}
                <label>
                    <div style={{ position: 'relative' }}>
                        <FaUser style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', color: '#e0ac69' }} />
                        <input
                            type="text"
                            placeholder="Your Fullname"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            style={{ paddingLeft: '40px' }}
                        />
                    </div>
                </label>

                {/* Mobile Number */}
                <label>
                    <div style={{ position: 'relative' }}>
                        <FaPhoneAlt style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', color: '#1C7E45' }} />
                        <input
                            type="number"
                            placeholder="Mobile Number"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            style={{ paddingLeft: '40px' }}
                        />
                    </div>
                </label>

                {/* Email */}
                <label>
                    <div style={{ position: 'relative' }}>
                        <FaEnvelope style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', color: 'Orange' }} />
                        <input
                            type="email"
                            placeholder="Your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ paddingLeft: '40px' }}
                        />
                    </div>
                </label>

                {/* Password */}
                <label>
                    <div style={{ position: 'relative' }}>
                        <RiLockPasswordFill style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', color: '#123456' }} />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Your Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ paddingLeft: '40px' }}
                        />
                        <span
                            className='iiccoonn'
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '55%',
                                transform: 'translateY(-50%)',
                                cursor: 'pointer',
                                fontSize: '17px',
                                color: 'black'
                            }}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                </label>

                {/* Confirm Password */}
                <label>
                    <div style={{ position: 'relative' }}>
                        <RiLockPasswordFill style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', color: '#123456' }} />
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={{ paddingLeft: '40px' }}
                        />
                        <span
                            className='iiccoonn'
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '55%',
                                transform: 'translateY(-50%)',
                                cursor: 'pointer',
                                fontSize: '17px',
                                color: 'black'
                            }}
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                </label>

                {/* Address Line 1 */}
                <label>
                    <div style={{ position: 'relative' }}>
                        <FaMapMarkerAlt style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', color: '#B22222' }} />
                        <input
                            type="text"
                            placeholder="Street and House Number"
                            value={addressLine1}
                            onChange={(e) => setAddressLine1(e.target.value)}
                            style={{ paddingLeft: '40px' }}
                        />
                    </div>
                </label>

                {/* Address Line 2 */}
                <label>
                    <div style={{ position: 'relative' }}>
                        <FaMapMarkerAlt style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', color: 'black' }} />
                        <input
                            type="text"
                            placeholder="Area and Nearby Landmark"
                            value={addressLine2}
                            onChange={(e) => setAddressLine2(e.target.value)}
                            style={{ paddingLeft: '40px' }}
                        />
                    </div>
                </label>

                {/* City */}
                <label>
                    <div style={{ position: 'relative' }}>
                        <FaCity style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', color: '#5E7D7E' }} />
                        <input
                            type="text"
                            placeholder="City"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            style={{ paddingLeft: '40px' }}
                        />
                    </div>
                </label>

                {/* State */}
                <label>
                    <div style={{ position: 'relative' }}>
                        <FaFlag style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', color: 'black' }} />
                        <input
                            type="text"
                            placeholder="State"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            style={{ paddingLeft: '40px' }}
                        />
                    </div>
                </label>

                {/* Postal Code */}
                <label>
                    <div style={{ position: 'relative' }}>
                        <FaGlobe style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', color: 'maroon' }} />
                        <input
                            type="text"
                            placeholder="Pincode"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            style={{ paddingLeft: '40px' }}
                        />
                    </div>
                </label>

                {/* Country */}
                <label>
                    <div style={{ position: 'relative' }}>
                        <FaGlobe style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', color: '#B5651D' }} />
                        <input
                            type="text"
                            placeholder="Country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            style={{ paddingLeft: '40px' }}
                        />
                    </div>
                </label>

                <button type="submit" className="submit" style={{ marginTop: '10px' }}>
                    Sign Up
                </button>

            </form>
        </div>
    );
};

export default Signuppage;
