import React from 'react';
import { Link } from 'react-router-dom';
import './Adminpage.css';


const Adminpage = () => {
  return (

    <div className='admin-page'>
      <h1>Admin Dashboard</h1>
      <div className='admin-buttons'>
        <Link to='/addproduct' >
          <button>Add Product</button>
        </Link>
        <Link to='/allproduct' >
          <button>All Products</button>
        </Link>
        <Link to='/allorders' >
          <button>All Orders</button>
        </Link>
        <Link to='/usertickets'>
          <button >User tickets</button>
        </Link >

      
         
      </div>
    </div>
    
  );
};

export default Adminpage;
