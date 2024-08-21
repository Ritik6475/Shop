import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaBoxes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';
import axiosInstance from '@axios';

function Navbar({ onProfileClick, isLoggedIn, username, userId }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [cartCount, setCartCount] = useState(0); // State to hold the cart count
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch cart count from the API
        const fetchCartCount = async () => {
            if (!userId) {
                return;
            }

            try {
                const response = await axiosInstance.post('/getCartCount', { userId,isLoggedIn});
                setCartCount(response.data.cartCount);
            } catch (error) {
                console.error('Error fetching cart count:', error);
            }  
        };

        fetchCartCount();
    }, [userId]);

    const handleSearch = () => {
        if (searchQuery.trim() !== '') {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    return (
        <>


            <nav className="navbar" >


            <div className="promo-banner">
  <div className="promo-content">
    <div className="promo-text">
    <img src="https://cdn.pixabay.com/photo/2017/01/13/01/22/ok-1976099_1280.png" alt="promo-icon" />
    <p>Free home delivery on order worth ₹ 699 and above</p>
    </div>
    <div className="promo-text">
    <img src="https://cdn.pixabay.com/photo/2017/01/13/01/22/ok-1976099_1280.png" alt="promo-icon" />
    <p>No Question asked Return within 7 days</p>
    </div>
    <div className="promo-text">
    <img src="https://cdn.pixabay.com/photo/2017/01/13/01/22/ok-1976099_1280.png" alt="promo-icon" />
    <p>Exceptional Customer Service @ 8435541370</p>
    </div>
    <div className="promo-text">
    <img src="https://cdn.pixabay.com/photo/2017/01/13/01/22/ok-1976099_1280.png" alt="promo-icon" />
        <p>Subscribe on newsletter to get notifications about best offers</p>
    </div>
  </div>
</div>






                <div className="search">
                    <input
                        className="input"
                        type="text"
                        placeholder="Search for Price, Products, Brands and More        "
                        value={searchQuery}
                        onChange={handleInputChange}
                        onKeyPress={(event) => event.key === 'Enter' && handleSearch()}
                    />
                    <FaSearch className="searchicon" onClick={handleSearch} />
                </div>
                <div className="logo" style={{ marginRight: '330px',  position:'sticky'}}>
                    <Link className="logo-img" to="/">
                        <img
                            src="https://aartisto.com/wp-content/uploads/2020/11/myntra.png"
                            alt="logo"
                        />
                    </Link>
                </div>
                
                <div className="user-icons">
                    <div className="profile-user" onClick={onProfileClick}>
                        <div className="profile-name">
                        <Link to="/loginpage">
                               
                                <p className="profile-name">
                            
                                    {isLoggedIn ? username : 'Login/Sign up'}
                            
                            
                                </p>

                                    </Link>
                        </div>
                    </div>  


                    <div className="profile-user">
                        <div className="bag-name">
                            <Link to="/cart">
                                <FaShoppingCart className="wishlist" />
                                {cartCount > 0 && <span className="cart-count">{cartCount}</span>} {/* Display cart count */}
                                <p className="bag-name">Cart</p>
                            </Link>
                        </div>
                    </div>
                    <div className="profile-user">
                        <div className="bag-name">
                            <Link to="/yourorder">
                                <FaBoxes className="Bag" />
                                <p className="bag-name">Your Orders</p>
                            </Link>
                        
                        </div>
                    </div>
                </div>
                
            </nav>
            
            <div className="nav2">
                <Link to="/womenwestern">WOMEN WESTERN</Link>
                <Link to="/regionalattires">REGIONAL ATTIRES</Link>
                <Link to="/womenethnic">WOMEN ETHNIC</Link>
                <Link to="/">HOME</Link>
                <Link to="/saree">SAREE'S</Link>
                <Link to="/accessories">WOMEN'S ESSENTIALS</Link>
                <Link to="/salwarsuits">SALWAR & SUITS</Link>
            </div>
        </>
    );
}

export default Navbar;
