import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Card3.css';
import { Link } from 'react-router-dom';
import axiosInstance from '@axios';  

const Card3 = ({ category }) => {
    const [latestProducts, setLatestProducts] = useState([]);

    useEffect(() => {
        const fetchProductsByCategory = async () => {
            try {
                const response = await axiosInstance.post('/products/category', { category });
                const allProducts = response.data;
                const latestProducts = allProducts.slice(-15).reverse(); // Get the last 10 products and reverse them to show the most recent first
                setLatestProducts(latestProducts);
            } catch (error) {
                console.error('Error fetching products by category:', error);
            }
        };

        fetchProductsByCategory();
    }, [category]);

    const renderStars = (averageRating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= averageRating) {
                stars.push(<span key={i} className="card3-star">&#9733;</span>);
            } else {
                stars.push(<span key={i} className="card3-star">&#9734;</span>);
            }
        }
        return stars;
    };

    useEffect(() => {
        // Scroll to top when the component mounts
        window.scrollTo(0, 0);
    }, []);
    

    const calculateDiscountPercentage = (oldPrice, newPrice) => {
        if (oldPrice && newPrice && oldPrice > newPrice) {
            const discount = ((oldPrice - newPrice) / oldPrice) * 100;
            return Math.round(discount) + '% off';
        }
        return '';
    };

    return (
        <div className='card3-kards'>
            {latestProducts.map(product => (
                <div key={product.id} className="card3-product-card">
                    <Link to={`/product`} state={{ product }} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="card3-product-image">
                            {/* <img src={`./api${product.image}`} alt={product.productname} /> */}

                            <img src={`${import.meta.env.VITE_API_BASE_URL}${product.image}`} alt={product.brandname} />

                            <button className="card3-quick-view">Checkout Product</button>
                        </div>
                        <div className="card3-product-details">
                            <h3 className="card3-product-brand">{product.brandname}</h3>
                            <p className="card3-product-name">{product.productname}</p>
                            <div className="card3-product-rating">
                                {renderStars(product.averageRating)}
                            </div>
                        
                            <div className="card3-price-discount">
                                <p className="card3-product-price">₹{product.new_price}</p>
                                {product.old_price && 
                                    <>
                                        <p className="card3-product-old-price">₹{product.old_price}</p>
                                        <p className="card3-product-discount">{calculateDiscountPercentage(product.old_price, product.new_price)}</p>
                                  
                                    </>
                                }  
                            </div>
                          
                        </div>
                    </Link>
                </div>
            ))}
        </div>  
    );
};

export default Card3;
