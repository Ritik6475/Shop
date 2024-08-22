import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Card2.css';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import ProductFilter from './ProductFilter';
import axiosInstance from '@axios';

const Card2 = ({ category, isLoggedIn, userId }) => {
    const [products, setProducts] = useState([]);
    const [hoveredProduct, setHoveredProduct] = useState(null);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        const fetchProductsByCategory = async () => {
            try {
                const response = await axiosInstance.post('/products/category', { category });
                const sortedProducts = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setProducts(sortedProducts);
                setFilteredProducts(sortedProducts);
            } catch (error) {
                console.error('Error fetching products by category:', error);
            }
        };
  
        fetchProductsByCategory();
    }, [category]);

    const addToCart = async (product) => {
        if (!isLoggedIn) {
            alert('Please log in to add items to your cart.');
            return;
        }

        if (product.colors.length > 0 && !selectedColor) {
            alert('Please select a color.');
            return;
        }

        if (product.sizes.length > 0 && !selectedSize) {
            alert('Please select a size.');
            return;
        }

        try {
            const response = await axiosInstance.post('/cart', {
                userId,
                product,
                size: selectedSize || '',
                color: selectedColor || ''
            });
            alert(response.data.message);
            window.location.reload();  // Refresh the page
        
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add product to cart');
        }
    };

    const calculateDiscountPercentage = (oldPrice, newPrice) => {
        if (oldPrice && newPrice && oldPrice > newPrice) {
            const discount = ((oldPrice - newPrice) / oldPrice) * 100;
            return Math.round(discount) + '% off';
        }
        return '';
    };

    // Handle price filter
    const handlePriceFilter = (selectedPriceRange) => {
        let filteredProducts;
        
        if (selectedPriceRange === 'Above 5000') {
          filteredProducts = products.filter(product => product.price > 5000);
        } else {
          const [min, max] = selectedPriceRange.split('-').map(Number);
          filteredProducts = products.filter(product => product.price >= min && product.price <= max);
        }
      
        setFilteredProducts(filteredProducts);
    };

    // Handle filter change
    const handleFilterChange = (filters) => {
        const filtered = products.filter(product => {
            return (
                (!filters.brand.length || filters.brand.includes(product.brandname)) &&
                (!filters.color.length || filters.color.some(color => product.colors.includes(color))) &&
                (!filters.size.length || filters.size.some(size => product.sizes.includes(size))) &&
                (!filters.priceRange.length || 
                  (filters.priceRange[0] === 'Above 5000' ? product.price > 5000 : 
                  (product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]))) &&
                (!filters.discount.length || product.old_price && filters.discount.includes(calculateDiscountPercentage(product.old_price, product.new_price)))
            );
        });
        setFilteredProducts(filtered);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const renderStars = (averageRating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= averageRating) {
                stars.push(<span key={i} className="card2-star">&#9733;</span>);
            } else {
                stars.push(<span key={i} className="card2-star">&#9734;</span>);
            }
        }
        return stars;
    };

    const handleColorClick = (color) => {
        setSelectedColor(color);
    };

    const handleSizeClick = (size) => {
        setSelectedSize(size);
    };

    const displayProducts = filteredProducts.length > 0 ? filteredProducts : products;

    return (
        <div className='card2-kards'>
            <div className="card2-filter-container">
                <ProductFilter 
                    products={products} 
                    onFilterChange={handleFilterChange} 
                />
            </div>

            {displayProducts.map(product => (
                <div
                    key={product.id}
                    className="card2-product-card"
                    onMouseEnter={() => setHoveredProduct(product.id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                >
                    <Link to={`/product`} state={{ product }} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="card2-product-image">

                              {/* {<img src={`./api${product.image}`} alt={product.productname} />
                      }
                      */}


{
                     <img src={`${import.meta.env.VITE_API_BASE_URL}${product.image}`} alt={product.productname} /> }

                        </div>
                        <div className="card2-product-details">
                            <h3 className="card2-product-brand">{product.brandname}</h3>
                            <p className="card2-product-name">{product.productname}</p>
                            <div className="card2-price-discount">
                                <p className="card2-product-price">₹{product.new_price}</p>
                                {product.old_price && 
                                    <>
                                        <p className="card2-product-old-price">₹{product.old_price}</p>
                                        <p className="card2-product-discount">{calculateDiscountPercentage(product.old_price, product.new_price)}</p>
                                    </>
                                }
                            </div>
                            <div className="card2-product-rating">
                                {renderStars(product.averageRating)}
                            </div>
                        </div>
                    </Link>

                    {hoveredProduct === product.id && (
                        <div className="card2-hover-details">
                            {product.colors.length > 0 && (
                                <div className="card2-hover-detail-section">
                                    <h4>Color</h4>
                                    <div className="card2-color-options">
                                        {product.colors.map((color, index) => (
                                            <div 
                                                key={index} 
                                                className={`card2-color-box ${selectedColor === color ? 'selected' : ''}`} 
                                                style={{ backgroundColor: color }}
                                                onClick={() => handleColorClick(color)}
                                            >
                                                <span 
                                                    className="color-text"
                                                    style={{ color: color }}
                                                ></span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {product.sizes.length > 0 && (
                                <div className="card2-hover-detail-section">
                                    <h4>Available sizes</h4>
                                    <div className="card2-size-options">
                                        {product.sizes.map((size, index) => (
                                            <div 
                                                key={index} 
                                                className={`card2-size-box ${selectedSize === size ? 'selected' : ''}`} 
                                                onClick={() => handleSizeClick(size)}
                                            >{size}</div>
                                        ))}
                                    </div>
                                </div>
                            )}
                          
                            <button className="card2-add-to-bag" onClick={() => addToCart(product)}>  
                                <p style={{ marginBottom: '10px' }}>Add to bag</p>
                            </button>
                        
                        </div>
                    )}
                </div>
            ))}
            <Footer/>
        </div>
    );
};

export default Card2;
