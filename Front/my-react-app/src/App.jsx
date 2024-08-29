import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios'; // Make sure you have axios installed and imported
import Navbar from '../Components/Navbar';
import Navtwo from '../Components/Navtwo';
import EditProduct from '../Components/Editproduct';
import Usertickets from '../Components/Adminpage/Usertickets';
import Card2 from '../Components/Card2';
import Footer from '../Components/Footer';
import Loginpage from '../Components/Loginpage';
import Cartpage from '../Components/Cartpage/Cartpage';
import Adminpage from '../Components/Adminpage/Adminpage';
import PasswordPrompt from '../Components/PasswordPrompt'; // Import the PasswordPrompt
import axiosInstance from '@axios';
import Newsletter from '../Components/Adminpage/Newsletter';

import Orderpage from '../Components/Orderpage/Orderpage';
import Addproduct from '../Components/Adminpage/Addproduct';
import Allproducts from '../Components/Adminpage/Allproducts';
import Allorders from '../Components/Adminpage/Allorders';



import { AlertProvider } from '../AlertContext';
import GlobalAlert from '../Components/GlobalAlert';
import Selectproductpage from '../Components/Selectproductpage';
import Offerpage from '../Components/Offerpage'; // Ensure this import is correct
import Paymentgateway from '../Components/Paymentgateway';
import './App.css';
import SearchPage from '../Components/SearchPage';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Regionalattires from '../Components/Extrapages/Regionalattires';
import DeliveryAddress from '../Components/DeliveryAddress';
import Homepage from '../Components/Homepage';
import Feedback from '../Components/Feedback';
import ProductFilter from '../Components/ProductFilter';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');
    const [showLogin, setShowLogin] = useState(false);
    const [isAdminAuthorized, setIsAdminAuthorized] = useState(false); // Add this line

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        const storedUserId = localStorage.getItem('userId');
        if (storedUsername && storedUserId) {
            setUsername(storedUsername);
            setUserId(storedUserId);
            setIsLoggedIn(true);
        }
    }, []);

    const handleLoginSuccess = (username, userId) => {
        setIsLoggedIn(true);
        setUsername(username);
        setUserId(userId);
        localStorage.setItem('username', username);
        localStorage.setItem('userId', userId);
        setShowLogin(false);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUsername('');
        setUserId('');
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        setShowLogin(true);
    };

    const handleProfileClick = () => {
        setShowLogin(prevShowLogin => !prevShowLogin);
    };  

    const applyCoupon = async (couponCode) => {
        try {
            const response = await axiosInstance.post('/applyCoupon', {
                userId,
                couponCode
            });

            alert(response.data.message);
        } catch (error) {
            console.error('Error applying coupon:', error);
            alert('Failed to apply coupon');
        }
    };




    return (
        <AlertProvider>

        <Router>
            <Navbar
                isLoggedIn={isLoggedIn}
                username={username}
                onProfileClick={handleProfileClick}
                onLogout={handleLogout}
                userId={userId}
            />

            <Navtwo />  
            <Routes>
                <Route path="/loginpage" element={ <><Loginpage onLoginSuccess={handleLoginSuccess} onLogout={handleLogout} /><Footer isAdminAuthorized={isAdminAuthorized}/></> } />
                <Route path="/" element={<><Homepage /><Footer  isAdminAuthorized={isAdminAuthorized}/></>} />
                <Route path="/cart" element={<Cartpage isLoggedIn={isLoggedIn} username={username} onProfileClick={handleProfileClick} userId={userId} />} />
                

              
                <Route path="/search" element={<SearchPage />} />
             
                <Route path="/admin" element={isAdminAuthorized ? <Adminpage /> : <PasswordPrompt setIsAuthorized={setIsAdminAuthorized} />} />
                <Route path="/usertickets" element={isAdminAuthorized ? <Usertickets /> : <PasswordPrompt setIsAuthorized={setIsAdminAuthorized} />} />
<Route path="/addproduct" element={isAdminAuthorized ? <Addproduct /> : <PasswordPrompt setIsAuthorized={setIsAdminAuthorized} />} />
<Route path="/allproduct" element={isAdminAuthorized ? <Allproducts /> : <PasswordPrompt setIsAuthorized={setIsAdminAuthorized} />} />
<Route path="/allorders" element={isAdminAuthorized ? <Allorders /> : <PasswordPrompt setIsAuthorized={setIsAdminAuthorized} />} />
<Route path="/newsletter" element={isAdminAuthorized ? <Newsletter /> : <PasswordPrompt setIsAuthorized={setIsAdminAuthorized} />} />

   



                <Route path="/yourorder" element={<Orderpage userId={userId} />} />
                <Route path="/buynow" element={<Paymentgateway />} />
                <Route path="/product" element={<Selectproductpage isLoggedIn={isLoggedIn} userId={userId} />} />
                <Route path="/regionalattires" element={<Regionalattires isLoggedIn={isLoggedIn} userId={userId} />} />

                <Route path="/edit-product" element={<EditProduct />} />
                
                <Route path="/feedback" element={<Feedback isLoggedIn={isLoggedIn} userId={userId} />} />
                <Route path="/offers" element={<Offerpage applyCoupon={applyCoupon} />} />
                <Route path="/admin-password" element={<PasswordPrompt setIsAuthorized={setIsAdminAuthorized} />
} />
                
                <Route path="/saree" element={<Card2 category="Saree" isLoggedIn={isLoggedIn} userId={userId} />} />
                <Route path="/womenethnic" element={<Card2 category="Women Ethnic" isLoggedIn={isLoggedIn} userId={userId} />} />
                <Route path="/womenwestern" element={<Card2 category="Women Western" isLoggedIn={isLoggedIn} userId={userId} />} />
                <Route path="/accessories" element={<Card2 category="Accessories" isLoggedIn={isLoggedIn} userId={userId} />} />
                <Route path="/salwarsuits" element={<Card2 category="Salwar & Suits" isLoggedIn={isLoggedIn} userId={userId} />} />
                <Route path="/deliveryaddress" element={<DeliveryAddress userId={userId} />} />
            </Routes>
            <GlobalAlert/>
        </Router>
        </AlertProvider>

    );
}



export default App;
