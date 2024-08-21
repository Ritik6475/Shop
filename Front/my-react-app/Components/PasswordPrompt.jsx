// PasswordPrompt.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PasswordPrompt.css'

const PASSWORD = "1Q2w3e4r5t@"; // Replace with a strong password or hash

const PasswordPrompt = ({ setIsAuthorized }) => {
    const [password, setPassword] = useState('');
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
        <div className="password-prompt">
            <h2>Enter Admin Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default PasswordPrompt;
