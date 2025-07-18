import React, { useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";

const AddProductForm = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [cutoffPrice, setCutoffPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [uploadError, setUploadError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadError(null);
    setSuccess("");
    try {
      const productsRef = collection(db, "products");
      const q = query(productsRef, orderBy("id", "desc"), limit(1));
      const querySnapshot = await getDocs(q);
      let nextId = 1;
      if (!querySnapshot.empty) {
        const maxId = querySnapshot.docs[0].data().id;
        nextId = maxId + 1;
      }

      await addDoc(productsRef, {
        title,
        price: parseFloat(price),
        cutoffPrice: parseFloat(cutoffPrice),
        description,
        image: imageUrl,
        category,
        id: nextId,
        tags: tags
          .split(",")
          .map((tag) => tag.trim().toLowerCase())
          .filter((tag) => tag.length > 0),
        createdAt: serverTimestamp()  
      });

      setTitle("");
      setPrice(0);
      setCutoffPrice(0);
      setDescription("");
      setImageUrl("");
      setCategory("");
      setTags("");
      setUploadError(null);
      setSuccess("Product added successfully!");
    } catch (error) {
      setUploadError("Error adding product: " + error.message);
      console.error("Error adding product: ", error);
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 420,
        margin: "40px auto",
        background: "#232323",
        borderRadius: 16,
        boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
        padding: "32px 28px",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 12, fontWeight: 700 }}>
        Add New Product
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label htmlFor="title" style={labelStyle}>
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={inputStyle}
          placeholder="Product title"
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label htmlFor="price" style={labelStyle}>
          Price
        </label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          style={inputStyle}
          placeholder="Price"
          min="0"
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label htmlFor="cutoffPrice" style={labelStyle}>
          Cutoff Price
        </label>
        <input
          type="number"
          id="cutoffPrice"
          value={cutoffPrice}
          onChange={(e) => setCutoffPrice(e.target.value)}
          required
          style={inputStyle}
          placeholder="0"
          min="0"
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label htmlFor="category" style={labelStyle}>
          Category
        </label>
        <input
          type="text"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          style={inputStyle}
          placeholder="Category"
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label htmlFor="description" style={labelStyle}>
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{ ...inputStyle, minHeight: 60, resize: "vertical" }}
          placeholder="Description"
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label htmlFor="tags" style={labelStyle}>
          Tags (comma-separated)
        </label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          style={inputStyle}
          placeholder="e.g. summer, casual, trending"
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label htmlFor="imageUrl" style={labelStyle}>
          Image URL
        </label>
        <input
          type="url"
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          required
          style={inputStyle}
          placeholder="Image URL"
        />
        {imageUrl && (
          <div style={{ marginTop: 10, textAlign: "center" }}>
            <img
              src={imageUrl}
              alt="Product Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "180px",
                borderRadius: 8,
                background: "#181818",
                border: "1px solid #444",
                margin: "0 auto",
              }}
            />
          </div>
        )}
      </div>
      {uploadError && (
        <div style={{ color: "#ff5252", marginTop: 8 }}>{uploadError}</div>
      )}
      {success && (
        <div style={{ color: "#4caf50", marginTop: 8 }}>{success}</div>
      )}
      <button
        type="submit"
        disabled={loading}
        style={{
          background: "#2196f3",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "12px 0",
          fontWeight: "bold",
          fontSize: "1.1rem",
          marginTop: 10,
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background 0.2s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = "#1976d2")}
        onMouseOut={(e) => (e.currentTarget.style.background = "#2196f3")}
      >
        {loading ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
};

const labelStyle = {
  marginBottom: 2,
  fontWeight: 500,
  color: "#fff",
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 6,
  border: "1px solid #444",
  background: "#181818",
  color: "#fff",
  fontSize: "1rem",
  outline: "none",
  boxSizing: "border-box",
};

export default AddProductForm;
