import React, { useEffect, useState } from 'react';
import './ProductFilter.css';

const ProductFilter = ({ products, onFilterChange }) => {
  const [filters, setFilters] = useState({
    brands: [],
    colors: [],
    sizes: [],
    prices: [],
    discountRanges: [],
    ratings: []
  });

  const [selectedFilters, setSelectedFilters] = useState({
    brand: [],
    color: [],
    size: [],
    priceRange: [],
    discount: [],
    rating: []
  });

  const [refreshTrigger, setRefreshTrigger] = useState(false);

  useEffect(() => {
    if (refreshTrigger) {
        window.location.reload();
    }
}, [refreshTrigger]);


  useEffect(() => {
    const availableBrands = Array.from(new Set(products.map(p => p.brandname)));
    const availableColors = Array.from(new Set(products.flatMap(p => p.colors))).filter(color => isColor(color));
    const availableSizes = Array.from(new Set(products.flatMap(p => p.sizes)));
    const availablePrices = [
      { label: 'Rs. 0 to Rs. 1000', min: 0, max: 1000 },
      { label: 'Rs. 1000 to Rs. 3000', min: 1000, max: 3000 },
      { label: 'Rs. 3000 to Rs. 5000', min: 3000, max: 5000 },
      { label: 'Above 5000', min: 5000, max: 100000 }
    ];
    const availableDiscounts = Array.from(
      new Set(products
        .map(p => calculateDiscountPercentage(p.old_price, p.new_price))
        .filter(d => d)
      )
    );
    const availableRatings = Array.from(new Set(products.map(p => Math.floor(p.averageRating))));

    setFilters({
      brands: availableBrands,
      colors: availableColors,
      sizes: availableSizes,
      prices: availablePrices,
      discountRanges: availableDiscounts,
      ratings: availableRatings
    });
  }, [products]);

  const calculateDiscountPercentage = (oldPrice, newPrice) => {
    if (oldPrice && newPrice && oldPrice > newPrice) {
      const discount = ((oldPrice - newPrice) / oldPrice) * 100;
      return Math.round(discount) + '% off';
    }
    return '';
  };

  const isColor = (color) => {
    const s = new Option().style;
    s.color = color;
    return s.color !== '' || /^#[0-9A-F]{6}$/i.test(color);
  };

  const handleFilterChange = () => {
    onFilterChange(selectedFilters);
  };

  const handleCheckboxChange = (e) => {
    const { name, value } = e.target;
    setSelectedFilters(prev => ({
      ...prev,
      [name]: prev[name].includes(value) ? prev[name].filter(item => item !== value) : [...prev[name], value]
    }));
  };

  const removeFilters = () => {
    setSelectedFilters({
      brand: [],
      color: [],
      size: [],
      priceRange: [],
      discount: [],
      rating: []
      
    });
    setRefreshTrigger(true);

  };

  return (
    <div className="product-filter">
      <h3>Filter Products</h3>
    
      <button className="remove-filters-button" onClick={removeFilters}>
      <img src="https://cdn-icons-png.flaticon.com/512/6159/6159296.png" alt="" />

        Clear Filters</button>
        

      <div className="filter-section">
        <h4>Brand</h4>
        <ul className="filter-list">
          {filters.brands.map(brand => (
            <li key={brand}>
              <input
                type="checkbox"
                id={brand}
                name="brand"
                value={brand}
                checked={selectedFilters.brand.includes(brand)}
                onChange={handleCheckboxChange}
              />
              <label htmlFor={brand}>{brand}</label>
            </li>
          ))}
        </ul>
      </div>

      <div className="filter-section">
        <h4>Colors</h4>
        <ul className="filter-list">
          {filters.colors.map(color => (
            <li key={color}>
              <input
                type="checkbox"
                id={color}
                name="color"
                value={color}
                checked={selectedFilters.color.includes(color)}
                onChange={handleCheckboxChange}
              />
              <label htmlFor={color}>
                <span className="color-dot" style={{ backgroundColor: color }}></span>
                {color}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="filter-section">
        <h4>Sizes</h4>
        <ul className="filter-list">
          {filters.sizes.map(size => (
            <li key={size}>
              <input
                type="checkbox"
                id={size}
                name="size"
                value={size}
                checked={selectedFilters.size.includes(size)}
                onChange={handleCheckboxChange}
              />
              <label htmlFor={size}>{size}</label>
            </li>
          ))}
        </ul>
      </div>

      <div className="filter-section">
        <h4>Price Range</h4>
        <ul className="filter-list">
          {filters.prices.map(price => (
            <li key={price.label}>
              <input
                type="checkbox"
                id={price.label}
                name="priceRange"
                value={price.label}
                checked={selectedFilters.priceRange.includes(price.label)}
                onChange={handleCheckboxChange}
              />
              <label htmlFor={price.label}>{price.label}</label>
            </li>
          ))}
        </ul>
      </div>

      <div className="filter-section">
        <h4>Discount Range</h4>
        <ul className="filter-list">
          {filters.discountRanges.map(discount => (
            <li key={discount}>
              <input
                type="checkbox"
                id={discount}
                name="discount"
                value={discount}
                checked={selectedFilters.discount.includes(discount)}
                onChange={handleCheckboxChange}
              />
              <label htmlFor={discount}>{discount}</label>
            </li>
          ))}
        </ul>
      </div>

      <div className="filter-section">
        <h4>Ratings</h4>
        <ul className="filter-list">
          {filters.ratings.map(rating => (
            <li key={rating}>
              <input
                type="checkbox"
                id={rating}
                name="rating"
                value={rating}
                checked={selectedFilters.rating.includes(rating)}
                onChange={handleCheckboxChange}
              />
              <label htmlFor={rating}>
                {[...Array(rating)].map((_, i) => (
                  <span key={i} className="star">&#9733;</span>
                ))}
                {[...Array(5 - rating)].map((_, i) => (
                  <span key={i + rating} className="star" >&#9734;</span>
                ))}
                ({rating})
              </label>
            </li>
          ))}
        </ul>
      </div>

      <button className="apply-filter-button" onClick={handleFilterChange}>Apply Filters</button>
    </div>
  );
};

export default ProductFilter;
