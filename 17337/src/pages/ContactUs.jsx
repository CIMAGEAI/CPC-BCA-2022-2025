import React, { useState, useEffect } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "../styles/ContactUs.css"; 

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [formState, setFormState] = useState({
    submitting: false,
    submitted: false,
    error: null,
  });

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsUserLoggedIn(true);
        setFormData((prevData) => ({
          ...prevData,
          name: user.displayName || "",
          email: user.email,
        }));
      } else {
        setIsUserLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState({ ...formState, submitting: true, error: null });

    try {
      await addDoc(collection(db, "contacts"), {
        ...formData,
        createdAt: new Date(),
      });
      setFormState({ submitting: false, submitted: true, error: null });
      setTimeout(() => {
        setFormState({ submitting: false, submitted: false, error: null });
        if (!isUserLoggedIn) {
          setFormData({ name: "", email: "", message: "" });
        } else {
          setFormData((prevData) => ({ ...prevData, message: "" }));
        }
      }, 3000);
    } catch (error) {
      console.error("Error adding contact message: ", error);
      setFormState({
        submitting: false,
        submitted: false,
        error: "Failed to send message. Please try again later.",
      });
    }
  };

  const getButtonText = () => {
    if (formState.submitting) return "Submitting...";
    if (formState.submitted) return "Thank You!";
    return "Submit";
  };

  return (
    <div className="contact-page-wrapper">
      <div className="contact-us-container">
        <h2>Contact Us</h2>
        <p>We'd love to hear from you! Please fill out the form below.</p>
        
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              readOnly={isUserLoggedIn}
              className={isUserLoggedIn ? 'readonly-input' : ''}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={formState.submitting || formState.submitted}
            className={formState.submitted ? 'btn-success' : ''}
          >
            {getButtonText()}
          </button>
          
          {formState.error && (
            <p className="error-message">{formState.error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactUs;