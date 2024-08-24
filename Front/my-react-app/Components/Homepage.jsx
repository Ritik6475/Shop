import React from 'react';
import Slider from 'react-slick';
import './Homepage.css'; // Import CSS file for styling
import { useState } from 'react';
import Card3 from './Card3';
import axios from 'axios';
import { Link } from 'react-router-dom';
import axiosInstance from '@axios';


const Homepage = () => {

    const category6 = "Regional Attires";
  
    const category1 = "Saree";
    const category2 = "Women Western";
    const category3 = "Accessories";
    const category4 = "Salwar & Suits";
    const category5 = "Women Ethnic";
    
    
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [message, setMessage] = useState('');
  
    const handleInputChange = (e) => {
      setWhatsappNumber(e.target.value);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (/^\d{10}$/.test(whatsappNumber)) {
        try {
          await axiosInstance.post('/newsletterSubscribe', { whatsappNumber });
          setMessage('Subscribed successfully, you will be added to Whatsapp Group Shortly');
          setWhatsappNumber(''); // Clear input after successful submission
        } catch (error) {
          console.error('Error subscribing to newsletter:', error.response.data.message);
          setMessage('Error subscribing to newsletter. Please try again later.');
        }
      } else {
        setMessage('Please enter a valid 10-digit WhatsApp number');
      }
      setTimeout(() => {
        setMessage('');
      }, 3000);
    };
  
  const bannerSettings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };
 
  const categories = [
    { name: 'Regional Attires', img: 'https://ambraee.com/cdn/shop/files/FEELS_LIKE_SUMMER_MOBILE_copy.webp?v=1719380267&width=1520', link: '/regionalattires' },
    { name: 'Women Ethnic', img: 'https://i.pinimg.com/originals/44/c8/09/44c8091ede64503d6a16d3f3fd96438a.jpg', link: '/womenethnic' },
    { name: 'Women Western', img: 'https://i.pinimg.com/originals/44/c8/09/44c8091ede64503d6a16d3f3fd96438a.jpg', link: '/womenwestern' },
    { name: 'Accessories', img: 'https://i.pinimg.com/originals/44/c8/09/44c8091ede64503d6a16d3f3fd96438a.jpg', link: '/accessories' },
    { name: 'Salwar & Suits', img: 'https://i.pinimg.com/originals/44/c8/09/44c8091ede64503d6a16d3f3fd96438a.jpg', link: '/salwarsuits' },
  ];

  const priceCategories = [
    { name: 'Shop under ₹ 500', img: 'https://i.pinimg.com/550x/41/e2/5e/41e25edaf4df3bc981541ee56f2d0925.jpg' },
    { name: 'Shop under ₹ 1000', img: 'https://i.pinimg.com/736x/c5/14/c2/c514c284709c151600c1fc9f02ad8f6f.jpg' },
    { name: 'Shop under ₹ 2000', img: 'https://i.pinimg.com/originals/3b/8f/40/3b8f40b443589c350c78c12aed06d1a5.jpg' },
    { name: 'Shop under ₹ 5000', img: 'https://i.pinimg.com/736x/f0/b0/2a/f0b02a167c5656bd6d9a597766f160ff.jpg' },
    { name: 'Shop above ₹ 10000', img: 'https://i.pinimg.com/originals/95/1d/93/951d93265c879a2ab25c6a3aa9c99443.jpg' },
  ];
 
  return (
    <div className="homepage">
      

      
      <Slider {...bannerSettings} className="banner-slider">
      
      
        <div>
        <Link to='/womenwestern' >
                <img src="https://ambraee.com/cdn/shop/files/Monsoon_Desktop_Banner_copy_ae813314-24d6-4bd9-8726-f66ab88c4ae5.webp?v=1721030230&width=1920" alt="Banner 1" />
       </Link>
        </div>


        <div>
        <Link to='/regionalattires' >
      
          <img src="https://ambraee.com/cdn/shop/files/Add_a_little_bit_of_body_text_20240704_191123_0000.jpg?v=1720141640&width=1920" alt="Banner 2" />
          </Link>
        </div>
        <div>  
        <Link to='/womenwestern' >
      
          <img src="https://ambraee.com/cdn/shop/files/Be_Date_Banner_Desktop_copy_29615a0c-44be-4792-8441-77e93d77a62e.webp?v=1720272763&width=1920" alt="Banner 3" />
          </Link>
        </div>
        <div>
        <Link to='/womenethnic' >
      
          <img src="https://ambraee.com/cdn/shop/files/FEELS_LIKE_SUMMER_copy_00a4124f-3f8c-4484-809d-ddfd70bc4ce3.webp?v=1719380255&width=1920" alt="Banner 3" />
          </Link>
        </div>
        <div>
        <Link to='/womenwestern' >
      
          <img src="https://ambraee.com/cdn/shop/files/TRAVEL_EDIT_copy.webp?v=1719380295&width=1920" alt="Banner 3" />
          </Link>
        </div>
      </Slider>

      <div class="scrolling-div">
        <div class="scrolling-text">
           <p>Get Extra 10% off By Using Coupon Code PROMO2024 
           &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
           Get Extra 10% off By Using Coupon Code PROMO2024 
           &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  &nbsp; &nbsp;    
           Get Extra 10% off By Using Coupon Code PROMO2024 
           &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
           Get Extra 10% off By Using Coupon Code PROMO2024 
           &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
      
           Get Extra 10% off By Using Coupon Code PROMO2024 

  
           </p>
          
          
        </div>
    </div>



    <div class="homepage-section">
    <div class="recently-launched-container">
        <h2 class="recently-launched-title">Recently Launched Sarees</h2>
    </div>
</div>

      
      <Card3 category={category1}/>
        <hr />

      <div className="price-section">
        <h2>SHOP BY PRICE</h2>
       
        <div className="price-categories">
          {priceCategories.map((priceCategory) => (
            <div key={priceCategory.name} className="price-category">

              <img src={priceCategory.img} alt={priceCategory.name} />
              <Link to='/saree'>
              <div className="price-category-overlay">{priceCategory.name}</div>
              </Link>
            </div>
          ))}
        </div>
       
        <Link to='/saree' style={{ textDecoration: 'none' }}>
  <button id='allbutton'>View all</button>
</Link>
<hr />

      </div>


      
      <div className='sareees'>
        <Link to='/womenwestern'>
    <img src="https://sudathi.com/cdn/shop/files/Western-Collection-banner-1-compressed.jpg?v=1719230238&width=2000" alt="" />
    </Link>
</div>

<div class="homepage-section">
    <div class="recently-launched-container">
        <h2 class="recently-launched-title">Recently Launched Western Attires</h2>
    </div>
</div> 

      
      <Card3 category={category2}/>
         
         <hr />


      <div style={{marginTop:'50px'}}>
      <Link to='/saree'>
        <img src="https://kalamandir.com/media/fbfeed/Banarasi.jpg" alt="" />
      
        <img   style={{marginLeft:'50px'}} src="https://kalamandir.com/media/fbfeed/Kanchipuram-Pattu.jpg" alt="" />
      </Link>
      </div>

      <div className="offers-section">
        <h2>Exclusive Offers</h2>
        <div className="offers">
          <div className="offer-item">50% off on Sarees</div>
          <div className="offer-item">Free Delivery Above order of ₹1000</div>
          <div className="offer-item">Flat 30% off on Salwar & Suits</div>
        </div>
      </div>

      <div className="category-icons">
  <div className="category-icon">
    <Link to='/saree' style={{ textDecoration: 'none', color: 'inherit' }}>
      <img src="https://www.koskii.com/cdn/shop/files/Category_Icons-02_3_360x.png?v=1713519888" alt="Sarees"/>
      <p style={{ textDecoration: 'none', color: 'inherit' }}>SAREE'S</p>
    </Link>
  </div>

  <div className="category-icon">
    <Link to='/salwarsuits' style={{ textDecoration: 'none', color: 'inherit' }}>
      <img src="https://www.koskii.com/cdn/shop/files/Category_Icons-04_2_360x.png?v=1713520005" alt="Lehengas"/>
      <p style={{ textDecoration: 'none', color: 'inherit' }}>SALWAR & SUITS</p>
    </Link>
  </div>

  <div className="category-icon">
    <Link to='/regionalattires' style={{ textDecoration: 'none', color: 'inherit' }}>
      <img src="https://www.koskii.com/cdn/shop/files/Category_Icons-03_2_360x.png?v=1713520031" alt="Salwar Suits"/>
      <p style={{ textDecoration: 'none', color: 'inherit' }}>LEHENGAS</p>
    </Link>
  </div>

  <div className="category-icon">
    <Link to='/womenethnic' style={{ textDecoration: 'none', color: 'inherit' }}>
      <img src="https://www.koskii.com/cdn/shop/files/Category_Icons-01_2_360x.png?v=1713520055" alt="Gowns"/>
      <p style={{ textDecoration: 'none', color: 'inherit' }}>GOWNS</p>
    </Link>
  </div>

  <div className="category-icon">
    <Link to='/saree' style={{ textDecoration: 'none', color: 'inherit' }}>
      <img src="https://www.koskii.com/cdn/shop/files/Category_Icons-08-16_2_360x.png?v=1713520082" alt="Pure Silk Sarees"/>
      <p style={{ textDecoration: 'none', color: 'inherit' }}>PURE SILK SAREES</p>
    </Link>
  </div>
</div>






<div className='sareees'>
<Link to='/saree'>
    <img src="https://sudathi.com/cdn/shop/files/Premium-Sarees-banner-compressed_1.jpg?v=1714109607&width=2000" alt="" />
</Link>
</div>

<hr />
      <div className="icon-blocks">
  
        <div className="icon-block">
          <img src="//ambraee.com/cdn/shop/files/secured_payments.png?v=1709894053" alt="Secure payment" />
          <h3>Secure payment</h3>
        </div>
        
          
        <div className="icon-block">
          <img src="//ambraee.com/cdn/shop/files/made_in_india.png?v=1709894104" alt="Made In India" />
          <h3>Made In India</h3>
        </div>
        
        <div className="icon-block">
          <img src="//ambraee.com/cdn/shop/files/Customer_Service.png?v=1709894149" alt="Prompt Customer Service" />
          <h3>Prompt Customer Service</h3>
        </div>
   
    </div>

    <div className="newsletter-section">
      <div className="newsletter-text">
        <h2>Newsletter Subscription</h2>
        <p>Sign up for weekly newsletters to receive information about the new arrivals, future events, and special discounts.</p>
      </div>
      <div className="newsletter-input">
        <input
          type="text"
          placeholder="ENTER YOUR WhatsApp Number"
          value={whatsappNumber}
          onChange={handleInputChange}
        />
        <button onClick={handleSubmit}>
          <span>Subscribe</span>
          <img src="https://cdn.shopify.com/s/files/1/0797/2284/0358/files/social.png" alt="WhatsApp Logo" />
        </button>
      </div>
      {message && <p className="success-message">{message}</p>}
    </div>

    <div class="custom__item-inner custom__item-inner--liquid"><div class="rte">
                <h2>Unveiling Your Inner Style Icon: Shree - Where Tradition Meets Modernity</h2>
<h3>Why Shree? It's more than just fashion, it's a feeling</h3>
<p>Embrace the timeless elegance of Indian heritage with a modern twist. Shree isn't just another clothing store; it's your gateway to rediscovering the magic of women's ethnic wear reimagined for the contemporary woman. Shree clothing has become a leading online destination for women seeking unique and trendy pieces that celebrate their heritage.
</p>
<h3>The Perfect Blend of Tradition and Modernity </h3>
<p>Shree stands out as the premier online destination for <strong>women's wear</strong>, renowned for its exquisite blend of traditional textiles and contemporary designs. Shree has revolutionised the way women perceive and purchase ethnic wear. The brand's commitment to quality, innovation, and customer satisfaction has made it a household name as the unique <strong>women's clothing</strong> online brand.
</p>
<h3>From Everyday Chic to Show-Stopping Statements: We've Got You Covered!</h3>
<p>Shree is dedicated to launching only the most stylish and trendy clothes for women. Each piece is thoughtfully designed to cater to the modern woman’s need for elegance and comfort while preserving the rich heritage of Indian craftsmanship. From everyday essentials to statement pieces, Shree ensures that every garment is a fashion-forward masterpiece in the realm of <strong>trendy and stylish clothes for women.</strong>
</p>
<p>We're more than just tradition. you'll find the latest trends reimagined for the ethnic wear lover. From statement kurta sets to flowy palazzos, discover fresh silhouettes and unique prints that will turn heads wherever you go.</p>
<h3>Never Be Caught Outdated: Our Innovative Designs Keep You Ahead of the Curve</h3>
<p>At Shree, quality is paramount. The brand meticulously selects the finest fabrics and ensures superior craftsmanship in every piece. This dedication to quality not only enhances the look and feel of the garments but also ensures durability and comfort, making <strong>Shree’s ethnic wear</strong> a reliable choice for any occasion in the <strong>women's wear</strong> category. Our <strong>unique women's clothing</strong> is built to last, offering lasting comfort and timeless style.</p>
<h3>Invest in Pieces You'll Love for Years to Come: Experience the Shree Difference</h3>
<p>Shree isn't just about women's wear, it's about empowering you to express your unique style. Explore our collections and discover the perfect blend of tradition and modern flair. Invest in quality pieces that will become treasured staples in your wardrobe, infused with a modern touch that empowers you to embrace your heritage and own your style.
</p>
              </div></div>







    </div>


);
};

export default Homepage;

//https://www.koskii.com/cdn/shop/files/Category_Icons-02_3_360x.png?v=1713519888
//https://www.koskii.com/cdn/shop/files/Category_Icons-04_2_360x.png?v=1713520005
//https://www.koskii.com/cdn/shop/files/Category_Icons-03_2_360x.png?v=1713520031
//https://www.koskii.com/cdn/shop/files/Category_Icons-01_2_360x.png?v=1713520055
//https://www.koskii.com/cdn/shop/files/Category_Icons-08-16_2_360x.png?v=1713520082