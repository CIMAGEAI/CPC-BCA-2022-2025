import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  getFirestore,
} from "firebase/firestore";
import "../styles/EditProductPage.css";

const EditProductPage = () => {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [search, setSearch] = useState("");
  const db = getFirestore();

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      setProducts(
        snapshot.docs.map((docSnap) => ({
          docId: docSnap.id,
          ...docSnap.data(),
        }))
      );
    };
    fetchProducts();
  }, [db]);

  const filteredProducts = products.filter((product) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    if (!isNaN(q) && q !== "") return String(product.id) === q;
    return (
      product.title?.toLowerCase().includes(q) ||
      product.category?.toLowerCase().includes(q) ||
      product.description?.toLowerCase().includes(q)
    );
  });

  const handleEdit = (product) => {
    setEditingId(product.docId);
    setEditData({
  title: product.title || "",
  price: product.price || "",
  cutoffPrice: product.cutoffPrice || "",
  category: product.category || "",
  description: product.description || "",
  image: product.image || product.imageUrl || "",
  id: product.id || "",
  tags: product.tags ? product.tags.join(", ") : "", 
});

  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (docId) => {
    await updateDoc(doc(db, "products", docId), {
  ...editData,
  price: Number(editData.price),
  cutoffPrice: Number(editData.cutoffPrice),
  id: Number(editData.id),
  tags: editData.tags
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => tag.length > 0),
});

    setProducts((prev) =>
  prev.map((p) =>
    p.docId === docId
      ? {
          ...p,
          ...editData,
          price: Number(editData.price),
          cutoffPrice: Number(editData.cutoffPrice),
          id: Number(editData.id),
          tags: editData.tags
            .split(",")
            .map((tag) => tag.trim().toLowerCase())
            .filter((tag) => tag.length > 0),
        }
      : p
  )
);

    setEditingId(null);
    alert("Changes saved!");
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const editingProduct = products.find((p) => p.docId === editingId);

  return (
    <div className="edit-container">
      <h2>Edit Products</h2>

      {!editingId && (
        <div className="edit-search-container">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search by title, category, id, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="edit-search"
            />
            <span className="search-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="9" cy="9" r="7" stroke="#aaa" strokeWidth="2" />
                <line
                  x1="14.4142"
                  y1="14"
                  x2="18"
                  y2="17.5858"
                  stroke="#aaa"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </div>
        </div>
      )}

      {editingId && editingProduct && (
        <>
          <div className="edit-overlay" />
          <div className="edit-modal">
            <h3>Edit Product</h3>
            <div className="edit-form">
              {["image", "title", "price", "cutoffPrice", "category", "description", "id", "tags"].map((field) => (
                <label key={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}:
                  <input
                    type={["price", "cutoffPrice", "id"].includes(field) ? "number" : "text"}
                    name={field}
                    value={editData[field]}
                    onChange={handleChange}
                    className="edit-input"
                  />
                </label>
              ))}
              <div className="edit-actions">
                <button onClick={() => handleSave(editingId)} className="btn-save">
                  Save
                </button>
                <button onClick={handleCancel} className="btn-cancel">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {!editingId && filteredProducts.length === 0 && <p>No products found.</p>}
      {!editingId && filteredProducts.length > 0 && (
        <div className="edit-table-wrapper">
        <table className="edit-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Cutoff Price</th>
              <th>Category</th>
              <th>Description</th>
              <th>Tags</th>
              <th>ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.docId}>
                <td>
                  <img
                    src={product.image || product.imageUrl}
                    alt={product.title}
                    className="edit-img"
                  />
                </td>
                <td>{product.title}</td>
                <td>₹{product.price}</td>
                <td>₹{product.cutoffPrice}</td>
                <td>{product.category}</td>
                <td className="edit-desc">{product.description}</td>
                <td className="edit-tags">{product.tags?.join(", ")}</td>
                <td>{product.id}</td>
                <td>
                  <button onClick={() => handleEdit(product)} className="edit-btn">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
};

export default EditProductPage;
