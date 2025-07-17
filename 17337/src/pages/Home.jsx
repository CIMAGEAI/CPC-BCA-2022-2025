import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase";
import ProductCard from "../components/ProductCard";
import "../styles/Home.css";
import { FaLaptop, FaTshirt, FaShoePrints } from "react-icons/fa";

const categories = [
  { name: "Electronics", icon: <FaLaptop />, path: "electronics" },
  { name: "T-shirts", icon: <FaTshirt />, path: "tshirts" },
  { name: "Shoes", icon: <FaShoePrints />, path: "shoes" },
];

const Home = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [products, setProducts] = useState([]);
  const { categoryName } = useParams();

  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("default");
  const [lastVisible, setLastVisible] = useState(null); 
  const [hasMore, setHasMore] = useState(true); 

  const PRODUCTS_PER_PAGE = 8;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setProducts([]);
      setHasMore(true);
      try {
        let productsQuery = query(collection(db, "products"));

        if (categoryName) {
          productsQuery = query(
            productsQuery,
            where("category", "==", categoryName.toLowerCase())
          );
        }

        switch (sortBy) {
          case "price-asc":
            productsQuery = query(productsQuery, orderBy("price", "asc"));
            break;
          case "price-desc":
            productsQuery = query(productsQuery, orderBy("price", "desc"));
            break;
          case "newest":
            productsQuery = query(productsQuery, orderBy("createdAt", "desc"));
            break;
          default:
            break;
        }

        productsQuery = query(productsQuery, limit(PRODUCTS_PER_PAGE));

        const documentSnapshots = await getDocs(productsQuery);

        const lastVisibleDoc =
          documentSnapshots.docs[documentSnapshots.docs.length - 1];
        setLastVisible(lastVisibleDoc);

        const productData = documentSnapshots.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productData);

        if (documentSnapshots.docs.length < PRODUCTS_PER_PAGE) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName, sortBy]);

  const fetchMoreProducts = async () => {
    if (!lastVisible) return;

    try {
      let productsQuery = query(collection(db, "products"));

      if (categoryName) {
        productsQuery = query(
          productsQuery,
          where("category", "==", categoryName.toLowerCase())
        );
      }

      switch (sortBy) {
        case "price-asc":
          productsQuery = query(productsQuery, orderBy("price", "asc"));
          break;
        case "price-desc":
          productsQuery = query(productsQuery, orderBy("price", "desc"));
          break;
        case "newest":
          productsQuery = query(productsQuery, orderBy("createdAt", "desc"));
          break;
        default:
          break;
      }

      productsQuery = query(
        productsQuery,
        startAfter(lastVisible),
        limit(PRODUCTS_PER_PAGE)
      );

      const documentSnapshots = await getDocs(productsQuery);

      const lastVisibleDoc =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];
      setLastVisible(lastVisibleDoc);

      const newProducts = documentSnapshots.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts((prevProducts) => [...prevProducts, ...newProducts]);

      if (documentSnapshots.docs.length < PRODUCTS_PER_PAGE) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching more products: ", error);
    }
  };

  return (
    <div className="home">
      {isHomePage && (
        <div className="hero-image">
          <img src="/images/BG.png" alt="Hero banner showcasing featured products" />
          <div className="hero-content">
            <Link to="/categories" className="hero-button">
              Shop Now
            </Link>
          </div>
        </div>
      )}
      {isHomePage && (
        <section className="category-showcase">
          <h2>Shop by Category</h2>
          <div className="category-grid">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/category/${category.path}`}
                className="category-item"
              >
                <div className="category-icon">{category.icon}</div>
                <span>{category.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
      <section className="product-grid-section">
        <div className="product-grid-header">
          <h2>
            {categoryName
              ? `${
                  categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
                }`
              : "Featured Products"}
          </h2>
          {/* ✅ Sorting Dropdown */}
          <div className="sort-container">
            <label htmlFor="sort-by">Sort by:</label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="product-grid skeleton-grid">
            {[...Array(PRODUCTS_PER_PAGE)].map((_, i) => (
              <div key={i} className="product-card-skeleton">
                <div className="skeleton-image"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text short"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {hasMore && (
              <div className="load-more-container">
                <button onClick={fetchMoreProducts} className="load-more-btn">
                  Load More
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="no-products-found">
            <h3>No products found.</h3>
            <p>Try a different category or check back later!</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
