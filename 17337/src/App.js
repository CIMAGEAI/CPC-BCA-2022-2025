import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import CartPage from "./pages/CartPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import Settings from "./pages/Settings";
import Categories from "./pages/Categories";
import NotAuthorized from "./pages/NotAuthorized";
import AdminDashboard from "./pages/AdminDashboard";
import DeleteProductPage from "./pages/DeleteProductPage";
import EditProductPage from "./pages/EditProductPage";
import CheckoutPage from "./pages/CheckoutPage";
import SubmitDetailsPage from "./pages/SubmitDetailsPage";
import PaymentPage from "./pages/PaymentPage";
import PaymentStatusPage from "./pages/PaymentStatusPage";
import ProductPage from "./pages/ProductPage";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import AddProductPage from "./pages/AddProductPage";
import OrdersPage from "./pages/OrdersPage";
import { Route, Routes, Navigate } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "./authContext"; 
import useSessionListener from './hooks/useSessionListener';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import "./styles/Variables.css";
import "./styles/Global.css";

function App() {
  const { isLoggedIn, userRole, loading } = useAuth();
    const [user, setUser] = useState(null);
  
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);
  
  // ✅ Activate the session listener whenever a user is logged in
  useSessionListener(user);
  
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const productsRef = collection(db, "products");
    const unsubscribe = onSnapshot(productsRef, (snapshot) => {
      const productsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "var(--primary-bg)",
          color: "var(--text-color)",
          fontSize: "1.5rem",
        }}
      >
        Loading...
      </div>
    );
  }

  const isAdmin = userRole === "root_admin" || userRole === "admin";

  return (
    <div
      className="App"
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Navbar
        isLoggedIn={isLoggedIn}
        products={products}
        userRole={userRole}
      />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          {isLoggedIn ? (
            <>
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/submit-details" element={<SubmitDetailsPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/account" element={<Account />} />
              <Route path="/settings" element={<Settings />} />
            </>
          ) : (
            <>
              <Route path="/cart" element={<Navigate to="/login" replace />} />
              <Route path="/checkout" element={<Navigate to="/login" replace />} />
              <Route path="/submit-details" element={<Navigate to="/login" replace />} />
              <Route path="/payment" element={<Navigate to="/login" replace />} />
              <Route path="/account" element={<Navigate to="/login" replace />} />
              <Route path="/settings" element={<Navigate to="/login" replace />} />
            </>
          )}
          
          <Route path="/payment-status/:merchantOrderId" element={<PaymentStatusPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:productId" element={<ProductPage />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/category/:categoryName" element={<Home />} />

          <Route
            path="/admin"
            element={
              isAdmin ? (
                <AdminDashboard />
              ) : (
                <Navigate to={isLoggedIn ? "/not-authorized" : "/login"} replace />
              )
            }
          />
          <Route
            path="/add-product"
            element={
              isAdmin ? (
                <AddProductPage />
              ) : (
                <Navigate to={isLoggedIn ? "/not-authorized" : "/login"} replace />
              )
            }
          />
          <Route
            path="/delete-product"
            element={
              isAdmin ? (
                <DeleteProductPage />
              ) : (
                <Navigate to={isLoggedIn ? "/not-authorized" : "/login"} replace />
              )
            }
          />
          <Route
            path="/edit-product"
            element={
              isAdmin ? (
                <EditProductPage />
              ) : (
                <Navigate to={isLoggedIn ? "/not-authorized" : "/login"} replace />
              )
            }
          />
          <Route path="/not-authorized" element={<NotAuthorized />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;