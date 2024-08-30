import React, { useState, useEffect } from 'react';
import Signuppage from './Signuppage';
import './Loginpage.css';
import { FaEye, FaEyeSlash, FaPhoneAlt } from 'react-icons/fa';
import axiosInstance from '@axios';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import { FcLock, FcUnlock } from 'react-icons/fc';

const Loginpage = ({ onLoginSuccess, onLogout }) => {
    const [showSignup, setShowSignup] = useState(false);
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');  

    const [isOtpSent, setIsOtpSent] = useState(false);
    const [showPassword, setShowPassword] = useState(false); 
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [isHoveredS, setIsHoveredS] = useState(false);
    const [isHoveredL, setIsHoveredL] = useState(false);
    const [isFieldActive, setIsFieldActive] = useState(false);
    const [showOtpToggle, setShowOtpToggle] = useState(false); // For toggling OTP section
    const [timeLeft, setTimeLeft] = useState(300);


    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);


    useEffect(() => {
        const timer = setInterval(() => {
          setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
        }, 1000);
    
        return () => clearInterval(timer);
      }, []);
    
      const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
      };
    

    useEffect(() => {
        // Save email and OTP to localStorage whenever they change
        localStorage.setItem('email', email);
        localStorage.setItem('otp', otp);
        localStorage.setItem('isOtpSent', isOtpSent);
    }, [email, otp, isOtpSent]);




    useEffect(() => {
        // Ensure the component retains state and does not reset or go blank
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                window.scrollTo(0, 0); // Ensures page is reset to top
            }
        };
    
        document.addEventListener('visibilitychange', handleVisibilityChange);
    
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);


    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/login', { mobileNumber, password });
            if (response.status === 200) {
                const { token, username, userId } = response.data;
                localStorage.setItem('token', token);
                setIsLoggedIn(true);
                setMobileNumber('');
                setPassword('');
                toast.success('Login successful!');
                onLoginSuccess(username, userId);
                window.location.href = '/';
            }
        } catch (error) {
            toast.error('Login failed. Check your Number and Password.');
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/verifyOtp', { email, otp });
            const { token, username, userId } = response.data;
            localStorage.setItem('token', token);
            toast.success('OTP verified successfully!');
            onLoginSuccess(username, userId);
            setIsLoggedIn(true);
            window.location.href = '/';
        } catch (error) {
            toast.error('Invalid or expired OTP. Please try again.');
        }
    };



    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleLogout = async () => {
        try {
            await axiosInstance.post('/logout', {}, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            localStorage.removeItem('token');
            setIsLoggedIn(false);
            onLogout();
            window.location.href = '/';
        } catch (error) {
            toast.error('Logout failed. Please try again.');
        }
    };
    

    const handleRequestOtp = async () => {
        try {
            const response = await axiosInstance.post('/requestOtp', { email });
            if (response.status === 200) {
                setIsOtpSent(true);
                toast.success('OTP sent to your email!');
            }
        } catch (error) {
            toast.error('Failed to request OTP. Please try again.');
        }
    };
    
    



    return (
                <div className={`cont ${showSignup ? 's--signup' : ''}`} style={{ marginTop: '150px', fontFamily: 'Nunito' }}>



         
{!isOtpSent &&  (


  <div style={{
    display: 'flex',  
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50px',
    padding: '20px',
    marginLeft: '-240px',
    background: 'linear-gradient(to right, black, #3E3F45)' 

    
  }}>
    <h2 style={{
      fontSize: '28px',
      color: 'White',
      marginBottom: '40px',
      textAlign: 'center',
      fontWeight: 'bold',
      fontFamily: 'Nunito'

    }}>
      Login via OTP
    </h2>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '15px'
    }}>

      <input
        type="email"
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{
          width: '100%',
          maxWidth: '350px',
          padding: '15px',
          borderRadius: '8px',
          border: '2px solid Gray',

          fontSize: '16px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          transition: 'border-color 0.3s ease'
        }}
      />
      <button onClick={handleRequestOtp} style={{
        padding: '12px 20px',
        backgroundColor: '#3F39A0',
     
        color: 'white',
        border: '1px solid white',
        borderRadius: '8px',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        padding:'7px'

        
      }
      }
      onMouseEnter={e => e.target.style.backgroundColor = '#4F47C8'}
      onMouseLeave={e => e.target.style.backgroundColor = '#3F39A0'}
    
      >
        Send OTP
      </button>
    </div>
  </div>
)}


{isOtpSent && (
  <form onSubmit={handleVerifyOtp} style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px',
    padding: '60px',
    minHeight: '50px',
    marginLeft:'-250px',
    justifyContent: 'center',
    background: 'White',
    marginTop:'0px'
  }}>
<img src="https://static.thenounproject.com/png/1241744-200.png" alt="" />
<p style={{marginBottom:'10px'}}>Enter the OTP you have received on mail</p>
<p style={{ fontWeight: 'bold',marginBottom:'10px' }}>Time Left: {formatTime(timeLeft)}</p>


    <input
      type="text"
      placeholder="Enter OTP"
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
      required
      style={{
        width: '100%',
        maxWidth: '350px',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid Black',
        fontSize: '16px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        transition: 'border-color 0.3s ease'
      }}
    />

    <button type="submit" style={{
      padding: '10px 20px',
      backgroundColor: '#1C7E45',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease'
    }}
    onMouseEnter={e => e.target.style.backgroundColor = '#239D56'}
    onMouseLeave={e => e.target.style.backgroundColor = '#1C7E45'}
  

    >
      Verify OTP
    </button>
  </form>
)}

            {!isOtpSent && (
                <div className="form sign-in" style={{ fontFamily: 'Nunito' }}>
                    <h2>Welcome</h2>
                    <form onSubmit={handleLogin}>
                        <label>
                            <div style={{ position: 'relative' }}>
                                <FaPhoneAlt style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', color: 'Black' }} />
                                <input
                                    type="number"
                                    placeholder="Your Mobile Number"
                                    value={mobileNumber}
                                    onChange={(e) => setMobileNumber(e.target.value)}
                                    required
                                    style={{ paddingLeft: '40px', border: '1.5px solid gray' }}
                                />
                            </div>
                        </label>

                        <label>
                          
                         
                        <div className="password-field" style={{ position: 'relative' }}>
            {isFieldActive ? (
                <FcUnlock style={{ fontSize: '24px', position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)' }} />
            ) : (
                <FcLock style={{ fontSize: '24px', position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)' }} />
            )}

            <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Your Password"
                value={password}
                onChange={handlePasswordChange}
                required
                style={{ paddingLeft: '40px', border: '1.5px solid gray' }}
                onFocus={() => setIsFieldActive(true)}
                onBlur={() => setIsFieldActive(false)}
            />

            <span
                className='iiccoonn'
                onClick={() => setShowPassword(!showPassword)}
                style={{
                    position: 'absolute',
                    right: '10px',
                    top: '60%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    fontSize: '22px',
                    color: 'black'

                }}
            >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
        </div>

                        </label>


                        <button
                            type="submit"
                            className="submit"
                            style={{
                                backgroundColor: '#3090C7',
                                fontWeight: '400',
                                background: '#3090C7',
                                border:'2px solid gray'  
                            }}
                       
                            onMouseEnter={e => e.target.style.backgroundColor = '#357EC7'}
                            onMouseLeave={e => e.target.style.backgroundColor = '#3090C7'}
                          
                       >
                            Login
                        </button>
                    </form>

                    {isLoggedIn && (
                            <button
                            onClick={handleLogout}
                            className="submit"
                            style={{
                                backgroundColor: '#E41B17',
                                background: isHoveredS ? '#C83F49' : '#E42217'
                            }}
                            onMouseEnter={() => setIsHoveredS(true)}
                            onMouseLeave={() => setIsHoveredS(false)}
                        >
                            Logout
                        </button>
                    )}
                </div>
  )}

            

            

            <div className="sub-cont">
                <div className="img">
                    <div className="img__text m--up">
                        <h3>Don't have an account? Please Sign up!</h3>
                    </div>
                    <div className="img__text m--in">
                        <h3>If you already have an account, just sign in.</h3>
                    </div>
                    <div className="img__btn" onClick={() => setShowSignup(!showSignup)}>
                        <span className="m--up" 


style={{backgroundColor:'#8B0000',padding:'none',borderRadius:'0px'}}
                        >Create Account
                        
                        </span>

                        <span className="m--in">Sign In</span>
                    </div>
                </div>
                <div className="form sign-up">
                    <Signuppage />
                </div>
            </div>
            <ToastContainer />

            
        </div>
    );
};

export default Loginpage;
