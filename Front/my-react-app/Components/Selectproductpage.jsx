import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaStar } from 'react-icons/fa';
import './Selectproduct.css';
import Card2 from './Card2';
import Footer from './Footer';
import axiosInstance from '@axios';

const Selectproductpage = ({ userId, isLoggedIn }) => {
    const location = useLocation();
    const { product } = location.state || {};
    const navigate = useNavigate();


    const category = "Saree";

    const [showOfferDetails, setShowOfferDetails] = useState(false);

    const toggleOfferDetails = () => {
      setShowOfferDetails(!showOfferDetails);
    };
  

    // Determine the first image key dynamically
    const initialImageKey = Object.keys(product || {}).find(key => key.startsWith('image')) || '';
    const [refreshTrigger, setRefreshTrigger] = useState(false);

    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    
    
    const [showReviews, setShowReviews] = useState(false);
    const [expandedImage, setExpandedImage] = useState(initialImageKey);
    const [showProductSpecs, setShowProductSpecs] = useState(true);
    const [showShippingInfo, setShowShippingInfo] = useState(false);
    const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
    const [deliveryAddress, setDeliveryAddress] = useState({});

    const toggleProductSpecs = () => setShowProductSpecs(!showProductSpecs);
    const toggleShippingInfo = () => setShowShippingInfo(!showShippingInfo);
    const toggleAdditionalInfo = () => setShowAdditionalInfo(!showAdditionalInfo);

    useEffect(() => {
        // Scroll to top when the component mounts or product changes
        window.scrollTo(0, 0);
    }, [product]);

    if (!product) {
        console.error('Product not found or not passed correctly.');
        return <div>Product not found.</div>;
    }

    useEffect(() => {
        if (refreshTrigger) {
            window.location.reload();
        }
    }, [refreshTrigger]);

    const addToCart = async () => {
        if (!isLoggedIn) {
            alert('Please log in to add items to your cart.');
            return;
        }
    
        if (!selectedSize || !selectedColor) {
            alert('Please select a size and color.');
            return;
        }
    
        try {
            const response = await axiosInstance.post('/cart', {
                userId,
                product,
                size: selectedSize,
                color: selectedColor,
            });
    
            // Check if the response contains an error message
            if (response.data.error) {
                alert(response.data.error);
            } else {
                // Display success message
                alert(`${response.data.message}. Please review your delivery address at the top of the cart page, as this will be the address used for product delivery.`);
                
                // Trigger cart refresh
                setRefreshTrigger(true);
            }
    
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Same product is already there in the cart');
        }
    };
    


    const getDeliveryDate = () => {
        const today = new Date();
        today.setDate(today.getDate() + 5);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return today.toLocaleDateString(undefined, options);
      };
    
    const calculateDiscountPercentage = (oldPrice, newPrice) => {
        if (oldPrice && newPrice && oldPrice > newPrice) {
            const discount = ((oldPrice - newPrice) / oldPrice) * 100;
            return Math.round(discount) + ' % off';
        }
        return '';
    };

    const buyNow = async () => {
        if (!isLoggedIn) {
            alert('Please log in to buy products.');
            return;
        }
    
        if (!selectedSize || !selectedColor) {
            alert('Please select a size and color.');
            return;
        }
    
        try {
            const response = await axiosInstance.post('/cart', {
                userId,
                product,
                size: selectedSize,
                color: selectedColor,
            });
            
            alert(response.data.message);
    
            // Assuming cart count gets updated globally
            setRefreshTrigger(true);
    
            // Navigate to cart page and force a reload
            navigate('/cart');
            window.location.reload();  // This will force the reload when the cart page is navigated to
    
        } catch (error) {
            console.error('Error adding product to cart:', error);
            alert('Failed to add product to cart');
        }
    };
    








    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= rating; i++) {
            stars.push(
                <FaStar key={i} className={i <= rating ? 'star filled' : 'star'} />
            );
        }
        return stars;
    };

    // Combine feedbacks with ratings
    const feedbacksWithRatings = product.feedback.map((feedback, index) => ({
        ...feedback,
        rating: product.ratings[index]?.value || 0,
    }));

    // Calculate average rating
    const averageRating = product.ratings.length > 0
        ? product.ratings.reduce((sum, rating) => sum + rating.value, 0) / product.ratings.length
        : 0;



    return (
        <>
            <div className='select-product-details-page'>
                <div className='select-product-details-container'>
                    <div className='select-product-image-container'>
                        <div className='product-thumbnails'>
                            {Object.keys(product).filter(key => key.startsWith('image')).map((key, index) => (
                                product[key] && (
                                    // <img
                                    //     key={index}
                                       
                                    //     src={`/api${product[key]}`}
                                       
                                    //     alt={`${product.brandname} - ${product.productname}`}
                                    //     className={`thumbnail ${expandedImage === key ? 'active' : ''}`}
                                    //     onClick={() => setExpandedImage(key)}
                                    // />
                                


                                    <img
    key={index}
    src={`${import.meta.env.VITE_API_BASE_URL}${product[key]}`}
    alt={`${product.brandname} - ${product.productname}`}
    className={`thumbnail ${expandedImage === key ? 'active' : ''}`}
    onClick={() => setExpandedImage(key)}
/>
                                
                                
                                
                                )
                            ))}
                        </div>
                        <div className='main-product-image'>
                            {expandedImage && (
                               
                            //    <img
                            //         src={`/api${product[expandedImage]}`}
                            //         alt={`${product.brandname} - ${product.productname}`}
                            //         className='selected-image'
                            //     />
                           
                            <img
                            src={`${import.meta.env.VITE_API_BASE_URL}${product[expandedImage]}`}
                            alt={`${product.brandname} - ${product.productname}`}
                            className='selected-image'
                        />
                        
                           
                           
                           )}
                            <br /><br /><br /><hr />
                            <div className="collapsible-section">
                                <h3 onClick={toggleProductSpecs} className="collapsible-header">PRODUCT SPECIFICATION</h3>
                                {showProductSpecs && (
                                    <div className="collapsible-content">
                                        <div className='product-specifications'>
                                            {product.specifications?.map((spec, index) => (
                                                <div key={index} className='spec-item'>
                                                    <div className='spec-key'>{spec.key}</div>
                                                    <div className='spec-value'>{spec.value}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <hr />
                            <div className="collapsible-section">
                                <h3 onClick={toggleShippingInfo} className="collapsible-header">SHIPPING INFORMATION</h3>
                                {showShippingInfo && (
                                    <div className="collapsible-content">
                                        <p>
                                            It is our sincere endeavour to offer you quick and hassle-free delivery. We partner with registered and trusted courier partners to ship your orders within India as well as overseas. Shipping timelines, however, may vary for varied products. Please refer to the product descriptions page to check each product’s estimated delivery time.
                                        </p>
                                        <h4>Domestic Shipping:</h4>
                                        <p>We provide free shipping within India for all Prepaid & Cash on Delivery (COD) orders.</p>
                                        <h4>International Shipping:</h4>
                                        <p>
                                            For international orders, the shipping fee is based on the total weight of the parcel that is calculated at the end of the order checkout. Please note that the weight for international shipping is charged per 500 gms, i.e. in case, the accumulated parcel weight is 1.25 gms, the shipping will be charged for 1.5 gms.
                                        </p>
                                        <p>
                                            In International orders, the duties & taxes if any, are not included in your order. They are applicable over and above the shipping charges paid at checkout.
                                        </p>
                                        <p>
                                            It is important to note that many countries charge import duties on shipped items that are levied at the time of port entry. The charges greatly differ based on the type of products imported and the destination country’s import duty policies. We bear no control over these charges and cannot estimate their cost, hence, if you, too, are unsure, we would highly recommend you to avail full information via your local customs office for duties and taxes if any before you place an order.
                                        </p>
                                        <p>
                                            Customers are liable to pay the applicable charges directly to the shipping/courier agency at the time of delivery. In case, the customer refuses or does not pay for these charges in any circumstances or does not accept the delivery, no refunds will be entertained from our end.
                                        </p>
                                    </div>
                                )}
                            </div>
                            <hr />
                            <div className="collapsible-section">
                                <h3 onClick={toggleAdditionalInfo} className="collapsible-header" style={{ marginLeft: '140px' }}>ADDITIONAL INFORMATION</h3>
                                {showAdditionalInfo && (
                                    <div className="collapsible-content">
                                        <p>
                                            Manufactured By:
                                            <br />
                                            SHREE ATTIRES ENTERPRISES
                                            <br />
                                            B-8, KARTARPURA INDUSTRIAL AREA,
                                            <br />
                                            22 GODOWN
                                            <br />
                                            Patnipura-452003 (Madhya pradesh)
                                            <br />
                                            GST NO.: 08ABYFA7653G1ZT
                                        </p>
                                        <p>Country Of Origin: India</p>
                                        <p>
                                            Customer Care Address:
                                            <br />
                                            Shree Attires by Rohit Sharma
                                            <br />
                                            B-8, Patnipura, Sharma Colony, 22 Godam, Indore – 452003
                                            <br />
                                            Email: rathodritik259@gmail.com
                                            <br />
                                            Phone: +91-8435541370, +91-7693843988
                                        </p>
                                    </div>
                                )}  
                            </div>
                        </div>
                    </div>
                    <div className='select-product-info'>
                        <h1 className='select-product-title'>{product.brandname}</h1>
                        <h1 className='select-product-subtitle'>{product.productname}</h1>
                        
                        <div className='select-product-average-rating'>
                            <div className='average-rating-stars'>
                                {renderStars(averageRating)}
                                <span className="average-rating-text">
                                    ({product.ratings.length} reviews)
                                </span>
                            </div>
                        </div>
                        <div className='select-product-prices'>
                            <p className='select-product-price'>₹{product.new_price}</p>
                            {product.old_price && (
                                <p className='select-product-price-old'>₹{product.old_price}</p>
                            )}
                            <p className="select-product-discount">{calculateDiscountPercentage(product.old_price, product.new_price)}</p>
                        </div>
                        <br />
                        <br />
                        <hr />
                        <p className="select-product-taxline">Inclusive Of all Taxes</p>
                        <div className='select-product-size'>
                            <h3>Select Size:</h3>
                            <div className='select-product-sizes'>
                                {product.sizes?.map((size, index) => (
                                    <div
                                        key={index}
                                        className={`select-product-size-option ${selectedSize === size ? 'selected' : ''}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <br />
                        <hr />
                        <div className='select-product-color'>
                            <h3>Select Color:</h3>
                            <div className='select-product-colors'>
                                {product.colors?.map((color, index) => (
                                    <div
                                        key={index}
                                        className={`select-product-color-option ${selectedColor === color ? 'selected' : ''}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => setSelectedColor(color)}
                                    />
                                ))}
                            </div>
                        </div>
                        <br />
                        <hr />
                        <br />  


                        <div className='product-stock-status'>
                            {product?.available ? (
                          <div className='instock' style={{fontSize:'18px',fontWeight:400,color:'Green'}}>In Stock</div>
                           ) : (
    
                           <div className='outofstock' style={{fontSize:'14px',fontWeight:400,color:'red'}}>Out of Stock</div>
                                )}
                           </div>


                        <br />
                        
                        <div className='select-button-container'>
                            <button className='select-buy-now-button' onClick={buyNow} >
    Buy Now
</button>
                            <button className='select-add-to-cart-button' onClick={addToCart}>Add to Cart</button>
                        
                        
                        </div>
                     
                     
                     
                     
                     
                     
                        <div className='offer-benefits' onClick={toggleOfferDetails}>
        <img src="https://cdn-icons-png.flaticon.com/512/2956/2956869.png" alt="Offers & Benefits" className='offer-benefits-icon' />
        <span>Offers & Benefits (Avail the offers on cart)</span>
      </div>

      {showOfferDetails && (
        <div className='offer-section'>
          <img src='https://png.pngtree.com/png-clipart/20230502/original/pngtree-promo-code-coupons-png-image_9134670.png' alt="Promo Code" className='offer-image' />
          <div className='offer-details'>
            <h3>Exclusive Offer!</h3>
            <p>Use code <strong>PROMO2024</strong> at checkout to save an additional 10% on your purchase!</p>
          </div>
        </div>
      )}




<div className='delivery-date'>
        <div className="offer-container">
          <div className="offer-section" >
            <img 
              src="https://static1.hkrtcdn.com/mbnext/static/media/delivery/green-tick.svg" 
              alt="Offer Icon" 
              style={{ width: '25px', height: '25px' }} 
            />
            <span style={{ color: 'Black', fontSize: '17px', marginLeft: '5px',fontWeight:'400' }}>
              Get it by {getDeliveryDate()}  
            </span>
          </div>
        </div>
      </div>
    








      {/* Div 2: Authentic Products, 14 Days Returnable, Free Shipping */}
      <div className='features'>
        <div className='feature'>
          <img src="https://static1.hkrtcdn.com/mbnext/static/media/icons/revamp/100safe_v1.svg" alt="Authentic Products" />
          <hr />
          <p><strong>Authentic Products</strong></p>
        </div>
        <div className='feature'>
          <img src="https://static1.hkrtcdn.com/mbnext/static/media/pdp/return_product_icon_v1.svg" alt="14 Days Returnable" />
          <hr />
          <p><strong>7 Days Returnable</strong></p>
        </div>
        <div className='feature'>
          <img src="https://static1.hkrtcdn.com/mbnext/static/media/icons/revamp/shipping_new_v1.svg" alt="Free Shipping" />
          <hr />
          <p><strong>Free Shipping Above order of 1000</strong></p>
        </div>
      </div>

                        <p className='select-product-description'>Product Description</p>
                        <p className='select-product-description'>{product.description}</p>
                        <div className='customer-reviews-box'>
                            <h3>CUSTOMER REVIEWS {renderStars(5)}</h3>
                            <div className='average-rating-box'>
                                <div className='rating-stars'>
                                {renderStars(product.averageRating)}


                                </div>
                                <p className='average-rating-value'>
                                    {averageRating.toFixed(2)} out of 5
                                </p>
                                <p className='based-on-reviews'>
                                    Based on {product.ratings.length} reviews
                                </p>
                            </div>
                            <button
                                className='toggle-reviews-button'
                                onClick={() => setShowReviews(!showReviews)}
                            >

                                    
                                {showReviews ? 'Hide Reviews' : 'Show Reviews'}
                            </button>
                            {showReviews && (
                                <div className='reviews-container'>
                                    {feedbacksWithRatings.length > 0 ? (
                                        feedbacksWithRatings.map((feedback, index) => (
                                            <div key={index} className='feedback-item'>
                                                <div className='feedback-header'>
                                                    <div className='rating-stars'>
                                                        {renderStars(feedback.rating)}
                                                     
                                                    </div>
                                                    <div className='feedback-user-info'>
                                                        <FaUser className="revieweruser" />
                                                        <div className='feedback-user-name'>{feedback.name}</div>
                                                    </div>
                                                </div>
                                                <div className='feedback-content'>
                                                    {feedback.content}
                                                    {feedback.image && (
                                                        <div className='feedback-image'>
                                                       
                                                            {/* <img
                                                                src={`/api/${feedback.image}`}
                                                                alt="feedback"
                                                            /> */}
                                                       
                                                       <img src={`${import.meta.env.VITE_API_BASE_URL}${feedback.image}`}
    alt="feedback"
/>

                                                       
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p style={{ marginLeft: '225px' }}>Buy this, and be the first to write a review</p>
                                    )}
                                </div>
                            )}
                        </div>
                        <br />
                        <hr />
                    </div>
                </div>
            </div>
            <br />
            <hr />
            <div className='similarcards' style={{marginTop:'20px',fontFamily:'Gill'}}>

                <h2 className='similarheading'>Similar products</h2>
                
                <br /><br />
                <div style={{marginTop:'-120px'}}>
                <Card2 category={category} isLoggedIn={isLoggedIn} userId={userId} />
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Selectproductpage;
