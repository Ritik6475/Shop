import React, { useState } from 'react';
import './Addproduct.css';
import Adminpage from './Adminpage';
import axios from 'axios';

 import axiosInstance from '@axios';

const Addproduct = () => {
  const [formData, setFormData] = useState({
    id: '',    
    brandname: '',
    productname: '',
    image: null,
    imagetwo: null,
    imagethree: null,
    imagefour: null,
    imagefive: null,
    imagesix: null,  
    imageseven: null,
    imageeight: null,
    category: '',
    new_price: '',
    old_price: '',
    material: '',
    description: '',
    available: 'true', // Default to 'true' for the input field
    color: [],
    sizes: [],
    specifications: [], // Add specifications state
  });

  const [sizeInput, setSizeInput] = useState('');
  const [colorInput, setColorInput] = useState('');
  const [specificationKey, setSpecificationKey] = useState('');
  const [specificationValue, setSpecificationValue] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, [e.target.name]: file });
  };

  const handleAddSize = () => {
    if (sizeInput && !formData.sizes.includes(sizeInput)) {
      setFormData({ ...formData, sizes: [...formData.sizes, sizeInput] });
      setSizeInput('');
    }
  };

  const handleRemoveSize = (sizeToRemove) => {
    setFormData({
      ...formData,
      sizes: formData.sizes.filter(size => size !== sizeToRemove),
    });
  };

  const handleAddColor = () => {
    if (colorInput && !formData.color.includes(colorInput)) {
      setFormData({ ...formData, color: [...formData.color, colorInput] });
      setColorInput('');
    }
  };

  const handleRemoveColor = (colorToRemove) => {
    setFormData({
      ...formData,
      color: formData.color.filter(color => color !== colorToRemove),
    });
  };

  const handleAddSpecification = () => {
    if (specificationKey && specificationValue) {
      setFormData({
        ...formData,
        specifications: [
          ...formData.specifications,
          { key: specificationKey, value: specificationValue },
        ],
      });
      setSpecificationKey('');
      setSpecificationValue('');
    }
  };

  const handleRemoveSpecification = (keyToRemove) => {
    setFormData({
      ...formData,
      specifications: formData.specifications.filter(
        spec => spec.key !== keyToRemove
      ),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    // Convert 'available' field to boolean
    const availableBoolean = formData.available === 'true';

    // Append fields to FormData
    formDataToSend.append('id', formData.id);
    formDataToSend.append('brandname', formData.brandname);
    formDataToSend.append('productname', formData.productname);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('new_price', formData.new_price);
    formDataToSend.append('old_price', formData.old_price);
    formDataToSend.append('material', formData.material);
    formDataToSend.append('available', availableBoolean);

    // Append image files if they exist
    if (formData.image) formDataToSend.append('image', formData.image);
    if (formData.imagetwo) formDataToSend.append('imagetwo', formData.imagetwo);
    if (formData.imagethree) formDataToSend.append('imagethree', formData.imagethree);
    if (formData.imagefour) formDataToSend.append('imagefour', formData.imagefour);
    if (formData.imagefive) formDataToSend.append('imagefive', formData.imagefive);
    if (formData.imagesix) formDataToSend.append('imagesix', formData.imagesix);
    if (formData.imageseven) formDataToSend.append('imageseven', formData.imageseven);
    if (formData.imageeight) formDataToSend.append('imageeight', formData.imageeight);

    // Append sizes and colors as arrays
    formData.sizes.forEach((size, index) => {
      formDataToSend.append(`sizes_${index}`, size);
    });
    formData.color.forEach((color, index) => {
      formDataToSend.append(`color_${index}`, color);
    });

    // Append specifications
    formData.specifications.forEach((spec, index) => {
      formDataToSend.append(`specifications_${spec.key}`, spec.value); // Use spec.key as the key
    });

    try {
      const response = await axiosInstance.post('/addproduct', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      console.log('Product created successfully');
      setShowAlert(true); // Show the alert upon successful creation
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  return (
    <div className='add-product-page'>
     
     
<div style={{marginLeft:'-30px',marginTop:'-50px'}}> <Adminpage />
          </div>

      <div className='form-container'>
        <h2>Create New Product</h2>
        <form onSubmit={handleSubmit}>
          <input type="number" name="id" placeholder='Product ID' onChange={handleFormChange} />
          <input type="text" name="brandname" placeholder='Brand Name' onChange={handleFormChange} />
          <input type="text" name="productname" placeholder='Product Name' onChange={handleFormChange} />
          <input type="text" name="description" placeholder='Description of product' onChange={handleFormChange} />
          <input type='file' name="image" onChange={handleImageChange} placeholder='image' />
          <input type='file' name="imagetwo" onChange={handleImageChange} placeholder='image' />
          <input type='file' name="imagethree" onChange={handleImageChange} placeholder='image' />
          <input type='file' name="imagefour" onChange={handleImageChange} placeholder='image' />
          <input type='file' name="imagefive" onChange={handleImageChange} placeholder='image' />
          <input type='file' name="imagesix" onChange={handleImageChange} placeholder='image' />
          <input type='file' name="imageseven" onChange={handleImageChange} placeholder='image' />
          <input type='file' name="imageeight" onChange={handleImageChange} placeholder='image' />

          <select name="category" onChange={handleFormChange}>
            <option value="">Select Category</option>
            <option value="Saree">Saree</option>
            <option value="Regional Attires">Regional Attires</option>
            <option value="Women Ethnic">Women Ethnic</option>
            <option value="Women Western">Women Western</option>
            <option value="Accessories">Accessories</option>
            <option value="Salwar & Suits">Salwar & Suits</option>
          </select>
          <input type="number" name="new_price" placeholder='Offer Price' onChange={handleFormChange} />
          <input type="number" name="old_price" placeholder='Price' onChange={handleFormChange} />
          <input type="text" name="material" placeholder='Product Material' onChange={handleFormChange} />
          <input type="text" name="available" placeholder='Available (true/false)' onChange={handleFormChange} />

          <div>
            <h3>Colors</h3>
            
            <p style={{marginTop:'20px', marginBottom:'20px', fontFamily:'Nunito'}}>Visit this link if trouble in finding color codes --><span style={{color:'#3090C7'}}>  https://www.computerhope.com/htmcolor.htm</span></p>
            <input
              type="text"
              value={colorInput}
              placeholder='Add Color Code ex :#1f3g4f'
              onChange={(e) => setColorInput(e.target.value)}
            />
            <button type="button" onClick={handleAddColor}>Add Color</button>
            <div>
              {formData.color.map((color, index) => (
                <span key={index} onClick={() => handleRemoveColor(color)}>
                  {color} <button type="button">X</button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3>Sizes</h3>
            <input
              type="text"
              value={sizeInput}
              placeholder='Add Sizes'
              onChange={(e) => setSizeInput(e.target.value)}
            />
            <button type="button" onClick={handleAddSize}>Add Size</button>
            <div>
              {formData.sizes.map((size, index) => (
                <span key={index} onClick={() => handleRemoveSize(size)}>
                  {size} <button type="button">X</button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3>Specifications</h3>
            <input
              type="text"
              value={specificationKey}
              placeholder='Specification Key'
              onChange={(e) => setSpecificationKey(e.target.value)}
            />
            <input
              type="text"
              value={specificationValue}
              placeholder='Specification Value'
              onChange={(e) => setSpecificationValue(e.target.value)}
            />
            <button type="button" onClick={handleAddSpecification}>Add Specification</button>
            <div>
              {formData.specifications.map((spec, index) => (
                <div key={index}>
                  <span>{spec.key}: {spec.value}</span>
                  <button type="button" onClick={() => handleRemoveSpecification(spec.key)}>X</button>
                </div>
              ))}
            </div>
          </div>

          <button type="submit">Add Product</button>
        </form>
        {showAlert && (
          <div className="alert">
            Product added successfully!
            <button onClick={closeAlert}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Addproduct;
