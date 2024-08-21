import React from 'react'
import './Filter.css';
function Filter() {

  return (
   
    <div className='filter'>
    <br />
    <h4>Filter by Price</h4>
<br />
    <input type="range" />
<br />
   <p style={{marginLeft:'16px'}}>Under 500 <input type="checkbox" style={{marginLeft:'16px'}}/></p>
   <p style={{marginLeft:'16px'}}>Under 1000 <input type="checkbox" style={{marginLeft:'8px'}}/></p>
   <p style={{marginLeft:'16px'}}>Under 3000 <input type="checkbox"style={{marginLeft:'8px'}}/></p>
   <p style={{marginLeft:'16px'}}>Under 5000 <input type="checkbox" style={{marginLeft:'8px'}}/></p>
   <p style={{marginLeft:'16px'}}>Under 10000 <input type="checkbox" style={{marginLeft:'0px'}}/></p>
<br />

    <hr />
    <br />
    <div className='filterbutton'>
    <h4>Filter by Category</h4>
    <button>Bags</button>
    <button>Saree's</button>
    <br />
    <button>Suits</button>
    <button>Women Ethics</button>
    <br />
    <button>Regional Attires</button>
    <button>Women Accessories</button>

</div>

<br />
   <hr /> 
  
    <h4 id='clr'>Filter by Color</h4>
    
    <input id='clrcheck' type="checkbox"/><div id='clrred' style={{background:'Yellow'}}></div> <p id='pred'>Yellow</p>
    <input id='clrcheck' type="checkbox"/><div id='clrred' style={{background:'Red'}}></div> <p id='pred'>Red</p>
    <input id='clrcheck' type="checkbox"/><div id='clrred' style={{background:'white'}}></div> <p id='pred'>White</p>
    <input id='clrcheck' type="checkbox"/><div id='clrred' style={{background:'Blue'}}></div> <p id='pred'>Blue</p>
    <input id='clrcheck' type="checkbox"/><div id='clrred' style={{background:'Green'}}></div> <p id='pred'>Green</p>
    <input id='clrcheck' type="checkbox"/><div id='clrred' style={{background:'Pink'}}></div> <p id='pred'>Pink</p>
    <input id='clrcheck' type="checkbox"/><div id='clrred' style={{background:'Navy'}}></div> <p id='pred'>Navy Blue</p>
    <input id='clrcheck' type="checkbox"/><div id='clrred' style={{background:'Yellow'}}></div> <p id='pred'>Yellow</p>
    <input id='clrcheck' type="checkbox"/><div id='clrred' style={{background:'Black'}}></div> <p id='pred'>Black</p>
    <input id='clrcheck' type="checkbox"/><div id='clrred' style={{background:'Maroon'}}></div> <p id='pred'>Maroon</p>
    <input id='clrcheck' type="checkbox"/><div id='clrred' style={{background:'Purple'}}></div> <p id='pred'>Purple</p>
    <input id='clrcheck' type="checkbox"/><div id='clrred' style={{background:'Beige'}}></div> <p id='pred'>Coral</p>
    <input id='clrcheck' type="checkbox"/><div id='clrred' style={{background:'#FFDB58'}}></div> <p id='pred'>Mustard</p>
    <input id='clrcheck' type="checkbox"/><div id='clrred' style={{background:'#556b2f'}}></div> <p id='pred'>Olive</p>
    <input id='clrcheck' type="checkbox"/><div id='clrred' style={{background:'#964B00'}}></div> <p id='pred'>Brown</p>
    <input id='clrcheck' type="checkbox"/><div id='clrred' style={{background:'#008080'}}></div> <p id='pred'>Teal</p>
    <input id='clrcheck' type="checkbox"/><div id='clrred' style={{background:'#F0E68C'}}></div> <p id='pred'>Khaki</p>
    <input id='clrcheck' type="checkbox"/><div id='clrred' style={{background:'#FF00FF'}}></div> <p id='pred'>Magenta</p>

    
    

    


</div>


)};

export default Filter