import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; // Make sure to create and link this CSS file

const Footer = ({isAdminAuthorized}) => {
  return (
    <div className="footer">
      <div className='footerupper'>
        {/* You can add content here if needed */}
      </div>

      <div className="footer-container">
        <div className="footer-column">
          <h3>TOP CATEGORIES</h3>
          <ul>
            <li>Suit Sets</li>
            <li>Kurta Sets</li>
            <li>Dresses</li>
            <li>Co-ord Sets</li>
            <li>Sarees</li>
            <li>Lehenga</li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>DISCOVER</h3>
          <ul>
            <li>About Us</li>
            <li>Exchange, Cancellation and Refund Policy</li>
            <li>Blogs</li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li>Size Chart</li>
            <li>Sitemap</li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>SUPPORT</h3>
          <ul>
            <li>Contact Us</li>
            <li>Raise a Support Query</li>
            <li>Submit for Returns & Exchanges</li>
            <li>Media Query</li>
            <li>Track Your Orders</li>
            <li>Your Addresses</li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>CONNECT WITH US</h3>
          <div className="social-media-icons">
            <img src="https://static1.hkrtcdn.com/mbnext/static/media/footer/desktop/insta_new.svg" alt="Instagram" />
            <img src="https://static1.hkrtcdn.com/mbnext/static/media/footer/desktop/linkedin_new_v1.svg" alt="LinkedIn" />
            <img src="https://static1.hkrtcdn.com/mbnext/static/media/footer/desktop/twitter_new.svg" alt="Twitter" />
            <img src="https://static1.hkrtcdn.com/mbnext/static/media/footer/desktop/youtube_new.svg" alt="YouTube" />
            <img src="https://static1.hkrtcdn.com/mbnext/static/media/footer/desktop/fb_new.svg" alt="Facebook" />


            <Link to={isAdminAuthorized ? "/admin" : "/admin-password"} className='adminbutton'>
                <p className="wishlist-name">Admin</p>
            </Link>

            
            <div className='securee-payment'>
              <div className='securee-payment-content'>
                <img src="https://static1.hkrtcdn.com/mbnext/static/media/common/SecurePayment/checked.png" alt="Secure Payment" />
                <p style={{textDecoration:'none' ,marginLeft:'-5px'}}>100% Safe & Secure payments:</p>
              </div>
              <div className='paymente-icons' style={{marginLeft:'40px'}}>
                <img src="https://static1.hkrtcdn.com/mbnext/static/media/common/SecurePayment/upi.png" alt="UPI" />
                <img src="https://static1.hkrtcdn.com/mbnext/static/media/common/SecurePayment/visa.png" alt="Visa" />
                <img src="https://static1.hkrtcdn.com/mbnext/static/media/common/SecurePayment/master.png" alt="MasterCard" />
                <img src="https://static1.hkrtcdn.com/mbnext/static/media/common/SecurePayment/netbanking.png" alt="Net Banking" />
                <img src="https://static1.hkrtcdn.com/mbnext/static/media/common/SecurePayment/emi.png" alt="EMI" />
                <img src="https://static1.hkrtcdn.com/mbnext/static/media/common/SecurePayment/cod.png" alt="Cash on Delivery" />
              </div>
            </div>

              
          </div>
        </div>
      </div>
         
     
      <div className='footerimg'>
        <img src="https://thevasanam.com/wp-content/uploads/2024/05/@bnr-2nd-min.png.webp" alt="Footer Banner" />
      </div>
    </div>
  );
};

export default Footer;
