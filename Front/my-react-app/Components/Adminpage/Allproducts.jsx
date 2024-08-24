import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Allproducts.css';
import { Link } from 'react-router-dom';
import Adminpage from './Adminpage';
import axiosInstance from '@axios';

const Allproducts = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axiosInstance.get('/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const handleDelete = async (productId) => {
        try {
            await axiosInstance.delete(`/products/${productId}`);
            setProducts(products.filter(product => product._id !== productId));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleEdit = (product) => {
        localStorage.setItem('productToEdit', JSON.stringify(product));
        navigate('/edit-product');
    };

    return (
        <div className="allproducts-container">
            <Adminpage />
            <h1>All Products</h1>
            <div className="products-list">
                {products.map(product => (
                    <div key={product._id} className="product-card">
                        {/* Wrap only the image and product information in the Link */}
                        <Link to={`/product`} state={{ product }} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <img src={`${import.meta.env.VITE_API_BASE_URL}${product.image}`} alt={product.productname} />
                            <div className="product-info">
                                <h3>{product.productname}</h3>
                                <p><strong>ID:</strong> {product._id}</p>
                                <p><strong>Price:</strong> ₹{product.new_price}</p>
                                <p><strong>Stock:</strong> {product.stock ? 'In Stock' : 'Out of Stock'}</p>
                            </div>
                        </Link>

                        {/* Separate the buttons from the Link */}
                        <div className="product-actions">
                            <button onClick={() => handleEdit(product)} className="edit-button">Edit</button>
                            <button onClick={() => handleDelete(product._id)} className="delete-button">Delete</button>
                        </div>
                    </div>
                ))}
            </div>   
        </div>
    );
};

export default Allproducts;
