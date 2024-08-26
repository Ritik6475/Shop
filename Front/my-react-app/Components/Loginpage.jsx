import React, { useState, useEffect } from 'react';  
import Signuppage from './Signuppage';   
import './Loginpage.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons
import axiosInstance from '@axios';

const Loginpage = ({ onLoginSuccess, onLogout }) => {
    const [showSignup, setShowSignup] = useState(false);
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [isHoveredL,setIsHoveredL] = useState('false');
    const [isHoveredS,setIsHoveredS] = useState('false');
    
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
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
        <div className={`cont ${showSignup ? 's--signup' : ''}`} style={{marginTop:'150px',fontFamily:'Nunito'}}>

            {isLoggedIn && (
                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            )}

            <div className="form sign-in" style={{fontFamily:'Nunito'}} >
                <h2>Welcome</h2>
                <form onSubmit={handleLogin}>
                    <label>
                        <input
                            type="number"
                            placeholder="Your Mobile Number"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            required
                      style={{border:'1.5px solid gray' }}
                      />
                        
                    </label>
                    <label>
                        <div className="password-field" style={{ position: 'relative'}}>
                            <input
                                type={showPassword ? 'text' : 'password'} // Toggle between text and password
                                placeholder="Your Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required

                                style={{border:'1.5px solid gray' }}

                            />
                            <span className='iiccoonn'

                                onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '63%',
                                    transform: 'translateY(-50%)',
                                    cursor: 'pointer',
                               fontSize:'22px',
                               color:'black'

                                }}
                            >
                                {showPassword ? <FaEye /> : <FaEyeSlash />} {/* Show appropriate icon */}
                            </span>
                        </div>
                    </label>
                  
                    {error && <div className="error-message">{error}</div>}
                
                    <button type="submit" className="submit" style={{backgroundColor:'#3090C7',fontWeight:'400',background: isHoveredL ? '#87AFC7' : '#3090C7'}}
                    
                    onMouseEnter={() => setIsHoveredL(true)}
                    onMouseLeave={() => setIsHoveredL(false)}
        
                    >Login</button>


                    {isLoggedIn && (
                        <button onClick={handleLogout} className="submit" style={{backgroundColor:'#E41B17',background: isHoveredS ? '#C83F49' : '#E42217	'}}
                        onMouseEnter={() => setIsHoveredS(true)}
                        onMouseLeave={() => setIsHoveredS(false)}
            
                        >Logout</button>
                    )}
                </form>
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
