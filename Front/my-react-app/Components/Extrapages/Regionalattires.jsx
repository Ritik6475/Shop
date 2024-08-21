import React from 'react';
import Card2 from '../Card2';

const Regionalattires = ({ isLoggedIn, userId }) => {
    const category = "Regional Attires";
   
    return (
        <>
            <Card2 category={category} isLoggedIn={isLoggedIn} userId={userId} />
            
        </>

    );
};


export default Regionalattires;
