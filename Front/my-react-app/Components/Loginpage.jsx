import React, { useState,useEffect } from 'react';  
// import axios from 'axios';
import Signuppage from './Signuppage'; 
import './Loginpage.css';

import axiosInstance from '@axios';

const Loginpage = ({ onLoginSuccess, onLogout }) => {
    const [showSignup, setShowSignup] = useState(false);
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

    const handleSignupClick = () => {
        setShowSignup(true);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post('/login', {
                mobileNumber,
                password,
            });

            if (response.status === 200) {
                const { username, userId, token } = response.data;
                localStorage.setItem('token', token);
                setIsLoggedIn(true);
                setMobileNumber('');
                setPassword('');
                setError('');
                alert('Login successful!');
                
                // Redirect to the previous page
                const redirectPath = localStorage.getItem('redirectPath') || '/';
                localStorage.removeItem('redirectPath');
                onLoginSuccess(username, userId);
                window.location.href = redirectPath;
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError('Invalid mobile number or password');
            } else {
                setError('Login failed. Please try again.');
            }
        }
    };
    useEffect(() => {
        // Scroll to top when the component mounts or product changes
        window.scrollTo(0, 0);
    },);


    const handleLogout = async () => {
        try {
            await axiosInstance.post('/logout', {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            localStorage.removeItem('token');
            setIsLoggedIn(false);
            onLogout();
            window.location.href = '/'; // Redirect to homepage after logout
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className={`cont ${showSignup ? 's--signup' : ''}`} style={{marginTop:'150px'}}>

            {isLoggedIn && (
                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            )}

            <div className="form sign-in">
                <h2>Welcome</h2>
                <form onSubmit={handleLogin}>
                    <label>
                        <input
                            type="number"
                            placeholder="Your Mobile Number"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <input
                            type="password"
                            placeholder="Your Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" className="submit">Login</button>

                         {isLoggedIn && (
                
                <button onClick={handleLogout} className="submit">Logout</button>
                    
             )}

                </form>
                <p className="forgot-pass">Forgot password?</p>
            </div>
            
            <div className="sub-cont">
                <div className="img">
                    <div className="img__text m--up">
                        <h3>Don't have an account? Please Sign up!</h3>
                    </div>
                    <div className="img__text m--in">
                        <h3>If you already have an account, just sign in.</h3>
                    </div>
                    <div className="img__btn" onClick={() => setShowSignup(!showSignup)}>
                        <span className="m--up">Create Account</span>
                        <span className="m--in">Sign In</span>
                    </div>
                </div>

                <div className="form sign-up">
                    <Signuppage setShowSignup={setShowSignup} />
                </div>
            </div>
        </div>
    );
};

export default Loginpage;
