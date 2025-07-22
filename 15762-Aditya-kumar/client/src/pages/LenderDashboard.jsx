import React, { useEffect, useState } from 'react';
import axios from 'axios';

function LenderDashboard() {
    const [myProducts, setMyProducts] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        axios.get(`http://localhost:5000/api/products/lender/${user.id}`)
            .then(res => setMyProducts(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h2>My Listed Items</h2>
            {myProducts.map(p => (
                <div key={p._id}>
                    <h4>{p.title}</h4>
                    <p>Status: Available</p>
                </div>
            ))}
        </div>
    );
}

export default LenderDashboard;
