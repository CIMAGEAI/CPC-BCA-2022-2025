import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  getFirestore,
} from "firebase/firestore";
import "../styles/DeleteProductPage.css";

const DeleteProductPage = () => {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState([]);
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
    if (!isNaN(q) && q !== "") {
      return String(product.id) === q;
    }
    return (
      product.title?.toLowerCase().includes(q) ||
      product.category?.toLowerCase().includes(q) ||
      product.description?.toLowerCase().includes(q)
    );
  });

  const handleDelete = async (docId) => {
    await deleteDoc(doc(db, "products", docId));
    setProducts(products.filter((product) => product.docId !== docId));
    setSelected(selected.filter((selId) => selId !== docId));
  };

  const handleSelect = (docId) => {
    setSelected((prev) =>
      prev.includes(docId)
        ? prev.filter((selId) => selId !== docId)
        : [...prev, docId]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(filteredProducts.map((p) => p.docId));
    } else {
      setSelected([]);
    }
  };

  const handleBulkDelete = async () => {
    await Promise.all(
      selected.map((docId) => deleteDoc(doc(db, "products", docId)))
    );
    setProducts(
      products.filter((product) => !selected.includes(product.docId))
    );
    setSelected([]);
  };

  return (
    <div className="delete-container">
      <h2>Delete Products</h2>
      <div className="delete-header">
        <button
          className="delete-button"
          onClick={handleBulkDelete}
          disabled={selected.length === 0}
        >
          Delete Selected ({selected.length})
        </button>

        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search by title, category, id, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="delete-search"
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

      {filteredProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <table className="delete-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={
                    filteredProducts.length > 0 &&
                    selected.length === filteredProducts.length
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Cutoff Price</th>
              <th>Category</th>
              <th>Description</th>
              <th>ID</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.docId}>
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(product.docId)}
                    onChange={() => handleSelect(product.docId)}
                  />
                </td>
                <td>
                  <img
                    src={product.image || product.imageUrl}
                    alt={product.title}
                    className="delete-img"
                  />
                </td>
                <td>{product.title}</td>
                <td>₹{product.price}</td>
                <td>₹{product.cutoffPrice}</td>
                <td>{product.category}</td>
                <td className="delete-desc">{product.description}</td>
                <td>{product.id}</td>
                <td>
                  <button
                    onClick={() => handleDelete(product.docId)}
                    className="delete-individual-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DeleteProductPage;
