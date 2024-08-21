import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';
import './SearchPage.css';
import axiosInstance from '@axios';

const SearchPage = () => {
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('query');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim() !== '') {
        try {
          const response = await axiosInstance.post('/search', { query: searchQuery });
          setSearchResults(response.data);
        } catch (error) {
          console.error('Error fetching search results:', error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  const renderStars = (averageRating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= averageRating) {
        stars.push(<span key={i} className="search-star">&#9733;</span>);
      } else {
        stars.push(<span key={i} className="search-star">&#9734;</span>);
      }
    }
    return stars;
  };

  const calculateDiscountPercentage = (oldPrice, newPrice) => {
    if (oldPrice && newPrice && oldPrice > newPrice) {
      const discount = ((oldPrice - newPrice) / oldPrice) * 100;
      return Math.round(discount) + '% off';
    }
    return '';
  };

  return (
    <div className='search-results-container'>
      <h1 className="search-page-header">Search Results for "{searchQuery}"</h1>
      <div className='search-card-container'>
        {searchResults.length > 0 ? (
          searchResults.map(product => (
            <div key={product._id} className="search-product-card">
              <Link to={`/product`} state={{ product }} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="search-product-image">
                
                  {/* <img src={`./api${product.image}`} alt={product.productname} />
                 */}

<img src={`${import.meta.env.VITE_API_BASE_URL}${product.image}`} alt={product.productname} />

                  <button className="search-quick-view">Quick View</button>
                </div>
                <div className="search-product-details">
                  <h3 className="search-product-brand">{product.brandname}</h3>
                  <p className="search-product-name">{product.productname}</p>
                  <div className="search-price-discount">
                    <p className="search-product-price">₹{product.new_price}</p>
                    {product.old_price && 
                      <>
                        <p className="search-product-old-price">₹{product.old_price}</p>
                        <p className="search-product-discount">{calculateDiscountPercentage(product.old_price, product.new_price)}</p>
                      </>
                    }
                  </div>
                  <div className="search-product-rating">
                    {renderStars(product.averageRating)}
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p className="search-no-results">No results found for "{searchQuery}"</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
