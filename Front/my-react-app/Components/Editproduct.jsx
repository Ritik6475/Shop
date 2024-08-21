import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './EditProduct.css';
import axiosInstance from '@axios';

const EditProduct = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        id: '',
        brandname: '',
        productname: '',
        image: '',
        imagetwo: '',
        imagethree: '',
        imagefour: '',
        imagefive: '',
        imagesix: '',
        imageseven: '',
        imageeight: '',
        category: '',
        description: '',
        new_price: '',
        old_price: '',
        available: true,
        material: '',
        colors: [],
        sizes: [],
        specifications: []
    });
    const [specifications, setSpecifications] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const product = JSON.parse(localStorage.getItem('productToEdit'));

                if (product) {
                    setFormData(product);
                    setSpecifications(product.specifications || []);
                    setColors(product.colors || []);
                    setSizes(product.sizes || []);
                } else {
                    navigate('/admin-products'); // Redirect if no product found
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                navigate('/admin-products');
            }
        };

        fetchProduct();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleImageChange = (e) => {
        const { name, files } = e.target;
        if (files.length > 0) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({
                    ...formData,
                    [name]: reader.result
                });
            };
            reader.readAsDataURL(files[0]);
        }
    };

    const handleSpecChange = (e, index) => {
        const { name, value } = e.target;
        const updatedSpecs = [...specifications];
        updatedSpecs[index] = { ...updatedSpecs[index], [name]: value };
        setSpecifications(updatedSpecs);
    };

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            
            const response = await axiosInstance.put(`/updateproducts/${formData.id}`, {
                ...formData,
                colors,
                sizes,
                specifications
            });
            if (response.status === 200) {
                alert('Product updated successfully!');
                navigate('/admin-products');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            alert(`Failed to update product. Error: ${error.response?.data.message || 'Unknown error'}`);
        }
    };
    
    return (
        <div className="edit-product-container">
            <h1>Edit Product</h1>
            <form onSubmit={handleSubmit} className="edit-product-form">
                <label>
                    Product Name:
                    <input
                        type="text"
                        name="productname"
                        value={formData.productname}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Brand Name:
                    <input
                        type="text"
                        name="brandname"
                        value={formData.brandname}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Category:
                    <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Description:
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    New Price:
                    <input
                        type="number"
                        name="new_price"
                        value={formData.new_price}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Old Price:
                    <input
                        type="number"
                        name="old_price"
                        value={formData.old_price}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Material:
                    <input
                        type="text"
                        name="material"
                        value={formData.material}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Available:
                    <input
                        type="checkbox"
                        name="available"
                        checked={formData.available}
                        onChange={() => setFormData({ ...formData, available: !formData.available })}
                    />
                </label>
                <label>
                    Main Image:
                    <input
                        type="file"
                        name="image"
                        onChange={handleImageChange}
                    />
                    {formData.image && <img src={formData.image} alt="Main" className="preview-image" />}
               

               
                </label>
                {/* Repeat for other image fields */}
                {['imagetwo', 'imagethree', 'imagefour', 'imagefive', 'imagesix', 'imageseven', 'imageeight'].map((img, index) => (
                    <label key={img}>
                        {img.replace('image', 'Image ')}:
                        <input
                            type="file"
                            name={img}
                            onChange={handleImageChange}
                            
                        />
                        {formData[img] && <img src={formData[img]} alt={img} className="preview-image" />}
                    </label>
                ))}
                <label>
                    Colors (comma separated):
                    <input
                        type="text"
                        name="colors"
                        value={colors.join(', ')}
                        onChange={(e) => setColors(e.target.value.split(',').map(color => color.trim()))}
                    />
                </label>
                <label>
                    Sizes (comma separated):
                    <input
                        type="text"
                        name="sizes"
                        value={sizes.join(', ')}
                        onChange={(e) => setSizes(e.target.value.split(',').map(size => size.trim()))}
                    />
                </label>
                <label>
                    Specifications:
                    {specifications.map((spec, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                name="key"
                                placeholder="Specification Key"
                                value={spec.key || ''}
                                onChange={(e) => handleSpecChange(e, index)}
                            />
                            <input
                                type="text"
                                name="value"
                                placeholder="Specification Value"
                                value={spec.value || ''}
                                onChange={(e) => handleSpecChange(e, index)}
                            />
                        </div>
                    ))}
                    <button type="button" onClick={() => setSpecifications([...specifications, { key: '', value: '' }])}>
                        Add Specification
                    </button>
                </label>
                <button type="submit" className="button">Save Changes</button>
            </form>
        </div>
    );
};

export default EditProduct;
