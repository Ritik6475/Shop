import React,{useState,useEffect} from 'react'

import './Navtwo.css'
import { FaUser, FaHeart, FaShoppingBag, FaSearch, FaShoppingCart, FaBoxes,FaFilter,FaBars } from 'react-icons/fa'; // Import Font Awesome icons
import Filter from './Filter';
import { Link } from 'react-router-dom';
import Homepage from './Homepage';


function Navtwo() {
  
    const [filterVisible, setFilterVisible] = useState(false);

    const handleToggleFilter = () => {
      setFilterVisible((prevFilterVisible) => !prevFilterVisible);
    
    };
  
  
  
    return (
<>
 
 
 
</>
)
}

export default Navtwo;