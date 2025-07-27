import React, { useState } from "react";

const SymptomRecommender = () => {
  const [symptom, setSymptom] = useState("");
  const [products, setProducts] = useState([]);

  const handleSearch = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/recommend/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptom }),
    });

    const data = await res.json();
    setProducts(data);
  };

  return (
    <div>
      <h3>🧠 Smart Product Recommendation</h3>
      <input
        type="text"
        placeholder="e.g. I have a fever"
        value={symptom}
        onChange={(e) => setSymptom(e.target.value)}
      />
      <button onClick={handleSearch}>Get Suggestions</button>

      <div className="container">
        {products.map((p, idx) => (
          <div key={idx} className="box">
            <img src={p.image} alt={p.name} height="150" />
            <h4>{p.name}</h4>
            <h5>₹{p.price}</h5>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SymptomRecommender;
