// src/Components/CategoryPage.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Categorypage.css'; // Make sure to create and style this CSS file
import { Link } from 'react-router-dom';
import axiosInstance from '@axios';

const CategoryPage = ({ category }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axiosInstance.get(`/products?category=${category}`);
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [category]);

    const calculateDiscountPercentage = (oldPrice, newPrice) => {
        if (oldPrice && newPrice && oldPrice > newPrice) {
            const discount = ((oldPrice - newPrice) / oldPrice) * 100;
            return Math.round(discount) + '% off';
        }
        return '';
    };

    const renderStars = (averageRating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= averageRating) {
                stars.push(<span key={i} className="star">&#9733;</span>);
            } else {
                stars.push(<span key={i} className="star">&#9734;</span>);
            }
        }
        return stars;
    };

    return (
        <div className='Kards'>
            {products.map(product => (
                <div key={product.id} className="product-card">
                    <Link to={`/product`} state={{ product }} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="product-image">
                      
                            {/* <img src={`./api${product.image}`} alt={product.productname} /> */}
                      
                            <img src={`${import.meta.env.VITE_API_BASE_URL}${product.image}`} alt={product.productname} />

                        </div>
                        <div className="product-details">
                            <h3 className="product-title">{product.brandname}</h3>
                            <p className="product-description">{product.productname}</p>
                            <p className="product-discount">({calculateDiscountPercentage(product.old_price, product.new_price)})</p>
                            <p className="product-price">₹{product.new_price}</p>
                            {product.old_price && 
                                <p className="product-price" style={{ marginTop: '-32px', marginLeft: '60px', fontSize: "18px", textDecoration: 'line-through' }}>₹{product.old_price}</p>
                            }
                            <div className="product-rating">
                                {renderStars(product.averageRating)}
                            </div>
                        </div>
                    </Link>
                    <div className="product-buttons">
                        <button 
                            className="add-to-cart-button"
                            onClick={() => addToCart(product)}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CategoryPage;
