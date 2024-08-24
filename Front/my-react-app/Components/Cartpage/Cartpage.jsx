            import React, { useEffect, useState } from 'react';
            import axios from 'axios';
            import { useNavigate } from 'react-router-dom';
            import './Cartpage.css';
            import DeliveryAddress from '../DeliveryAddress';
            import Footer from '../Footer';

import axiosInstance from '@axios';
            
const Cartpage = ({ userId,isLoggedIn }) => {
              const [refreshTrigger, setRefreshTrigger] = useState(false);
              const [CartCount, setCartCount] = useState(0); // State to hold the cart count
              const [couponCodes, setCouponCodes] = useState({}); // Temporary state to hold coupon codes for each product



              const [cart, setCart] = useState([]);
              const [totalPrice, setTotalPrice] = useState(0);
              const [totalItems, setTotalItems] = useState(0);
              const [deliveryAddress, setDeliveryAddress] = useState({});
              const [couponCode, setCouponCode] = useState('');
              const [discountApplied, setDiscountApplied] = useState(false);
              const [discountedPrice, setDiscountedPrice] = useState(0);
              const [deliveryFee, setDeliveryFee] = useState(0);
              const [animationClass, setAnimationClass] = useState('');

              const navigate = useNavigate();

              
    useEffect(() => {
      if (refreshTrigger) {
        
          window.location.reload();
      }
  }, [refreshTrigger]);
  

  
  
  useEffect(() => {
    

  window.scrollTo({
    top: 120,
    behavior: 'smooth'
  });
}, [userId]);



              useEffect(() => {
                const fetchCartData = async () => {
                  try {


                    const response = await axiosInstance.post('/getCartData', { userId });
                    const cartData = response.data.cart.map(item => ({
                      ...item,
                      quantity: item.quantity || 1,
                      productCouponCode: '',
                      buyNowDiscountedPrice: null,
                    }));
                    setCart(cartData);
                    calculateTotals(cartData);
                  } catch (error) {
                    console.error('Error fetching cart data:', error);
                  }
                };

                if (userId) {
                  fetchCartData();
                }
              }, [userId]);




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
        


            



              
              const removeFromCart = async (productId) => {
                try {
                  await axiosInstance.post('/removeFromCart', { userId, productId });
                  const updatedCart = cart.filter(product => product._id !== productId);
                  setCart(updatedCart);
                  calculateTotals(updatedCart);
                  setRefreshTrigger(true);

                } catch (error) {
                  console.error('Error removing product from cart:', error);
                }
              };
            
                       
              

              const calculateTotals = (cart) => {
                let total = 0;
                let items = 0;
                cart.forEach(product => {
                  total += product.new_price * product.quantity;
                  items += product.quantity;
                });
                setTotalPrice(total);
                setTotalItems(items);

                if (discountApplied) {
                  setDiscountedPrice(total * 0.9);
                } else {
                  setDiscountedPrice(total);
                }

                // Calculate delivery fee
                const fee = total >= 1000 ? 0 : 100;
                setDeliveryFee(fee);
              };

              
              const handleCouponChange = (productId, size, color, couponCodeValue) => {
                const uniqueKey = `${productId}-${size}-${color}`;
                setCouponCodes(prevCodes => ({
                  ...prevCodes,
                  [uniqueKey]: couponCodeValue
                }));
              };
              
              
              const applyCouponForProduct = (productId, size, color) => {
                const updatedCart = cart.map(product => {
                  if (product._id === productId && product.size === size && product.color === color) {
                    const enteredCouponCode = couponCodes[`${productId}-${size}-${color}`]; // Unique key based on productId, size, and color
              
                    if (enteredCouponCode === 'PROMO2024') {
                      if (!product.buyNowDiscountedPrice) {
                        product.buyNowDiscountedPrice = product.new_price * 0.9; // Apply 10% discount
                        alert('Coupon applied! You have received a 10% discount on this product.');
                      } else {
                        alert('Coupon already applied for this product.');
                      }
                    } else {
                      alert('Invalid coupon code.');
                    }
                  }
                  return product;
                });
              
                setCart(updatedCart);
                calculateTotals(updatedCart); // Recalculate totals after applying coupon
              };
              

              const applyCouponForBundle = () => {
                if (couponCode === 'PROMO2024') {
                  if (!discountApplied) {
                    const discountedTotal = totalPrice * 0.9;
                    setDiscountedPrice(discountedTotal);
                    setDiscountApplied(true);
                    setAnimationClass('coupon-applied');
                    setTimeout(() => setAnimationClass(''), 3000); // Remove class after animation
                    alert('Coupon applied! You have received a 10% discount on your bundle.');
                  } else {
                    alert('Coupon already applied.');
                  }
                } else {
                  alert('Invalid coupon code.');
                }
              };

              const increaseQuantity = (productId, size, color) => {
                const updatedCart = cart.map(product => {
                  if (product._id === productId && product.size === size && product.color === color) {
                    product.quantity += 1;
                  }
                  return product;
                });
                setCart(updatedCart);
                calculateTotals(updatedCart);
              };
              
              const decreaseQuantity = (productId, size, color) => {
                const updatedCart = cart.map(product => {
                  if (product._id === productId && product.size === size && product.color === color && product.quantity > 1) {
                    product.quantity -= 1;
                  }
                  return product;
                });
                setCart(updatedCart);
                calculateTotals(updatedCart);
              };
              






              const buyNow = (product) => {
                if (!product.available) {
                  alert('Sorry, this product is out of stock.');
                  return;
                }

                const finalPrice = product.buyNowDiscountedPrice || product.new_price * product.quantity;

                navigate('/buynow', { 
                  state: { 
                    amount: finalPrice,
                    quantity: product.quantity,
                    productId: product._id,
                    userId,
                    size: product.size,
                    color: product.color,
                    deliveryAddress 
                  } 
                });
              };

              const checkout = async () => {
                const outOfStockProducts = cart.filter(product => !product.available);

                if (outOfStockProducts.length > 0) {
                  alert('Some products are out of stock. Please remove them from your cart to proceed.');
                  return;
                }

                try {
                  const products = cart.map(product => ({
                    productId: product._id,
                    productName: product.productname,
                    price: product.new_price,
                    quantity: product.quantity,
                    size: product.size,
                    color: product.color,
                    image: product.image,
                  }));

                  const finalTotal = discountedPrice + deliveryFee;

                  const response = await axiosInstance.post('/saveBundleOrder', { userId, products, totalAmount: finalTotal, deliveryAddress });

                  if (response.status === 200) {
                    navigate('/buynow', { 
                      state: { 
                        amount: finalTotal, 
                        productId: null, 
                        userId, 
                        bundleOrderId: response.data.bundleOrderId, 
                        deliveryAddress 
                      } 
                    });
                  } else {
                    console.error('Error saving bundle order:', response.data.message);
                    alert('Error saving bundle order. Please try again.');
                  }
                } catch (error) {
                  console.error('Error saving bundle order:', error);
                  alert('Error saving bundle order. Please try again.');
                }
              };

              return (
                <div className={`cart-page ${animationClass}`}>
                  <DeliveryAddress userId={userId} onAddressChange={setDeliveryAddress} />
                  
                  
                  <div class="short-banner">
  <div class="short-content">
    <h2 class="short-title">Need Help? Raise a Ticket Now!</h2>
    <p class="short-text">If you have any complaints regarding your order, payment, product, or delivery, don't worry—we're here to help! Raise a ticket, and we'll address your issue within 2 days.</p>
    <p class="short-highlight">How to Raise a Ticket:</p>
    <p class="short-text">Raise a ticket with your Order ID or Product ID, select your issue type, and describe the problem. We've got you covered!</p>
    <ul class="short-steps">
      <li>📦 <strong>Order ID:</strong> Find it with each single order. Use it to raise a ticket.</li>
      <li>🛍️ <strong>Bundle Order:</strong> Find both Order ID and Product ID with bundle orders. Use them in your ticket description.</li>
    </ul>
    <p class="short-extra">Need help now? Call our customer care at <strong>@8435541370</strong> for immediate support.</p>
    <a href="#" class="short-button" onClick={() => setActiveSection('ticket')}>Raise a Ticket Now</a>

    <div class="short-faq">
      <h3>Common Issues We Help With:</h3>
      <p class="short-issues">🔄 Return Issues &nbsp; | &nbsp; 💳 Payment Problems &nbsp; | &nbsp; 🛠️ Product Concerns &nbsp; | &nbsp; 🚚 Shipping & Delivery</p>
    </div>
    <p class="short-footer">View your previous tickets in the <strong>Previous Ticket Section</strong>.</p>
  </div>
</div>

                  
                  
                  <div className='cart-container'>
                    <div className='cart-items'>
                      
                      {cart.map(product => (
                        <div key={product._id} className='cart-item'>
                          
                          <div className='grid-item product-image'>
                            
                          {/* ${import.meta.env.VITE_API_BASE_URL}
                       */}
                     
                            {/* <img src={`/api${product.image}`} alt={product.productname} /> */}
 
 <img src={`${import.meta.env.VITE_API_BASE_URL}${product.image}`} alt={product.productname} />


                          </div>
                          <div className='grid-item product-name'>
                          <p>{product.brandname}</p>
                          
                            <h3 style={{fontSize:'16px',marginTop:'10px'}}>{product.productname}</h3>
                          
                          </div>
                      
                          <div className='grid-item product-quantity'>
                         
                          <button 
        onClick={() => decreaseQuantity(product._id, product.size, product.color)} 
        disabled={product.quantity === 1}
      >
        -
      </button>
      <span>{product.quantity}</span>
      <button 
        onClick={() => increaseQuantity(product._id, product.size, product.color)}
      >
        +
      </button>

                          </div>

                          <div className="grid-item product-total">
                <p>₹{(product.new_price * product.quantity).toFixed(2)}</p>
                {product.buyNowDiscountedPrice && (
                  <p className="discounted-price">
                    Discounted Price: ₹{(product.buyNowDiscountedPrice * product.quantity).toFixed(2)}
                  </p>
                )}
              </div>
                          
                          <div className='grid-item product-details' style={{marginLeft:'40px',width:'100%'}}>
                            <p> Color: <span className="color-dot" style={{ backgroundColor: product.color }}></span>{product.color}</p>
                            <p>Size: {product.size}</p>
                          
                            <p>{product.available ? <span className='instock'>In Stock</span> : <span className='outofstock'>Out of Stock</span>}</p>
                          </div>


                          <div className="apply-coupon">
  <div className="coupon-header">
    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4agzRrxFUfsJ6g4NqLOlLidwjG8ZJ-HKL8Q&s" alt="Coupon Icon" className="coupon-icon" />
  </div>
  <div className="coupon-input">
    <input
      type="text"
      placeholder="Enter Coupon/Gift Code"
      className="coupon-code-input"
      value={couponCodes[`${product._id}-${product.size}-${product.color}`] || ''}
      onChange={(e) => handleCouponChange(product._id, product.size, product.color, e.target.value)}
    />
    <button  className="apply-coupon-button" style={{padding:'5px'}} onClick={() => applyCouponForProduct(product._id, product.size, product.color)}>
      Apply
    </button>
  </div>
</div>


                          <button className='remove-button' onClick={() => removeFromCart(product._id)} >
                            <img src="https://static1.hkrtcdn.com/mbnext/static/media/icons/delete-new.svg" alt="" />
                          
                            <span>Delete</span>
                          </button>

                        

                          <button className='buy-now-button' onClick={() => buyNow(product)}>

                            Place your order</button>
                                
                        {/* <p style={{marginTop:'-10px'}}>* If you want to purchase single item then purchase it from here</p> */}
                       
                        
                        

                        </div>
                        
                        


            ))}
                      <hr />
                      
                      
                    </div>
                    <br />

                    <div className='separator'></div> 

                    <div className='cart-summary'>
  <h2>PRICE DETAILS ({CartCount} Item)</h2>
  <div className='summary-item'>
    <span>Total MRP:</span>
    <span>₹{totalPrice.toFixed(2)}</span>
  </div>
 
  <div className='summary-item'>
    <span>Qty:</span>
    <span>{totalItems}</span>
  </div>

  <div className='summary-item'>
    <span>Coupon Discount:</span>
    <span style={{ color: '#239D56' }}>
      {discountApplied ? `-₹${(totalPrice - discountedPrice).toFixed(2)}` : 'Not Applied'}
    </span>
  </div>

  <div className='summary-item'>
    <span>Platform Fee:</span>
    <span>Free</span>
  </div>

  <div className='summary-item'>
    <span>Shipping Fee:</span>
    <span style={{ color: deliveryFee === 0 ? '#239D56' : 'red' }}>
      {deliveryFee === 0 ? 'Free shipping for you' : '₹100'}
    </span>
  </div>

  <hr />

  <div className='summary-item'>
    <span style={{ marginTop: '20px', fontWeight: 'bold' }}>Total Amount:</span>
    <span style={{ marginTop: '20px', color: '#3E3F45' }}>
      ₹{(discountedPrice + deliveryFee).toFixed(2)}
    </span>
  </div>

  <div className='coupon-summary'>
    <div className="coupon-header">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4agzRrxFUfsJ6g4NqLOlLidwjG8ZJ-HKL8Q&s" alt="Coupon Icon" className="coupon-icon" />
    </div>
    <div className="coupon-input">
      <input
        type="text"
        placeholder="Enter Coupon Code"
        className="coupon-code-input"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
      />
      <button className="apply-bundle-coupon-button" onClick={applyCouponForBundle}>Apply Coupon</button>
    </div>
  </div>  

  <button
    className='checkout-button'
    style={{marginTop:'10px'}}
    onClick={() => {
      if (CartCount === 1) {
        buyNow(cart[0]); // Assuming you want to buy the first item in the cart
      } else {
        checkout();
      }
    }}
  >
    {CartCount === 1 ? 'Buy Now' : 'Checkout'}
  </button>

</div>
                  </div>

<div style={{marginLeft:'-20px'}}>
                  <Footer />
                  </div>
                </div>
              );
            };

            export default Cartpage;
