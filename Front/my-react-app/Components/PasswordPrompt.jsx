import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons
import './PasswordPrompt.css';

const PASSWORD = "1Q2w3e4r5t@"; // Replace with a strong password or hash

const PasswordPrompt = ({ setIsAuthorized }) => {
    const [password, setPassword] = useState('');  
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === PASSWORD) {
            setIsAuthorized(true);
            navigate('/admin'); // Redirect to admin page after successful login
        } else {
            alert('Incorrect password');
        }
    };

    return (
        <div className="adminpassword-prompt" style={{ backgroundColor: 'White' }}>
            <h2>Enter Admin Password</h2>
            <form onSubmit={handleSubmit} style={{ backgroundColor: 'white' }}>
                <div className="password-field" style={{ position: 'relative' }}>
                    <input
                        type={showPassword ? 'text' : 'password'} // Toggle between text and password
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                    <span
                        onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '63%',
                            transform: 'translateY(-50%)',
                            cursor: 'pointer',
                            fontSize:'20px'
                        }}
                    >
                        {showPassword ? <FaEye /> : <FaEyeSlash />} {/* Show appropriate icon */}
                    </span>
                </div>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default PasswordPrompt;
