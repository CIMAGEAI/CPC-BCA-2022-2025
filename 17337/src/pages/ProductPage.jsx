import React, { useState, useEffect, useContext, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
    query,
    collection,
    getDocs,
    where,
    addDoc,
    serverTimestamp,
    deleteDoc,
    doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../authContext";
import "../styles/ProductPage.css";
import { CartContext } from "../contexts/CartContext";
import { FaTrash } from "react-icons/fa";

const ProductPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser } = useAuth();

    const [product, setProduct] = useState(null); 
    const { cartItems, addToCart, increaseQuantity, decreaseQuantity } =
        useContext(CartContext);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({
        username: "",
        rating: 5,
        text: "",
    });

    const cartItem = product ? cartItems?.find((item) => item.id === product.id) : null;
    const quantityInCart = cartItem ? cartItem.quantity : 0;


    useEffect(() => {
        const fetchProduct = async () => {
            if (!productId) return;
            const q = query(
                collection(db, "products"),
                where("id", "==", parseInt(productId))
            );
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const productDoc = querySnapshot.docs[0];
                setProduct({ firestoreId: productDoc.id, ...productDoc.data() });
            } else {
                console.log("No such product found!");
            }
        };
        fetchProduct();
    }, [productId]);

    const fetchReviews = useCallback(async () => {
        if (!productId) return;
        const q = query(
            collection(db, "reviews"),
            where("productId", "==", parseInt(productId))
        );
        const snapshot = await getDocs(q);
        setReviews(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    }, [productId]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    useEffect(() => {
        if (currentUser?.displayName) {
            setNewReview((prev) => ({ ...prev, username: currentUser.displayName }));
        }
        const pendingReviewData = sessionStorage.getItem("pendingReview");
        if (pendingReviewData) {
            const pendingReview = JSON.parse(pendingReviewData);
            if (pendingReview.productId === productId) {
                setNewReview((prev) => ({
                    ...prev,
                    rating: pendingReview.rating,
                    text: pendingReview.text,
                }));
            }
            sessionStorage.removeItem("pendingReview");
        }
    }, [currentUser, productId]);

    const handleAddToCart = useCallback(() => {
        if (!product) return;
        if (currentUser) {
            addToCart({ ...product, quantity: 1 });
        } else {
            alert("Please log in to add items to your cart.");
            navigate("/login", { state: { from: location, productToAdd: product } });
        }
    }, [currentUser, addToCart, product, navigate, location]);

    const handleBuyNow = useCallback(() => {
        if (!product) return;
        if (currentUser) {
            const quantityToSend = quantityInCart > 0 ? quantityInCart : 1;
            
            navigate("/checkout", { 
                state: { products: [{ ...product, quantity: quantityToSend }] } 
            });
        } else {
            alert("Please log in to buy this item.");
            navigate("/login", { state: { from: location, productToAdd: product } });
        }
    }, [currentUser, navigate, product, location, quantityInCart]);

    const handleIncrease = useCallback(() => {
        if (product) increaseQuantity(product.id);
    }, [increaseQuantity, product]);

    const handleDecrease = useCallback(() => {
        if (product) decreaseQuantity(product.id);
    }, [decreaseQuantity, product]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            sessionStorage.setItem(
                "pendingReview",
                JSON.stringify({ ...newReview, productId })
            );
            alert("Please log in to submit a review.");
            navigate("/login", { state: { from: location } });
            return;
        }
        const usernameToSubmit = currentUser.displayName || newReview.username;
        if (!usernameToSubmit || !newReview.text) {
            return alert("Please ensure your name and review text are filled out.");
        }
        try {
            await addDoc(collection(db, "reviews"), {
                username: usernameToSubmit,
                userId: currentUser.uid,
                rating: parseInt(newReview.rating),
                productId: parseInt(productId),
                createdAt: serverTimestamp(),
                text: newReview.text,
            });
            setNewReview({
                username: currentUser.displayName || "",
                rating: 5,
                text: "",
            });
            alert("Review submitted successfully!");
            fetchReviews(); 
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("Failed to submit review.");
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!reviewId) return;
        if (window.confirm("Are you sure you want to delete your review?")) {
            try {
                await deleteDoc(doc(db, "reviews", reviewId));
                setReviews((prevReviews) =>
                    prevReviews.filter((review) => review.id !== reviewId)
                );
                alert("Review deleted successfully.");
            } catch (error) {
                console.error("Error deleting review:", error);
                alert("Failed to delete review.");
            }
        }
    };

    if (!product) {
        return <div className="product-page">Loading...</div>;
    }

    return (
        <div className="product-page">
            <div className="product-header">
                <div className="product-container">
                    <div className="product-info">
                        <h1>{product.title}</h1>
                        <p>{product.description}</p>
                        <div className="price-box">
                            <div className="old-price">
                                <span>Regular:</span>
                                <s>₹{product.cutoffPrice}</s>
                            </div>
                            <div className="new-price">
                                <span>Sale:</span>
                                <strong>₹{product.price}</strong>
                            </div>
                        </div>
                        <div className="actions">
                            {quantityInCart > 0 ? (
                                <div className="product-page__quantity-control">
                                    <button
                                        className="product-page__quantity-btn"
                                        onClick={handleDecrease}
                                    >
                                        -
                                    </button>
                                    <span className="product-page__quantity-text">
                                        {quantityInCart}
                                    </span>
                                    <button
                                        className="product-page__quantity-btn"
                                        onClick={handleIncrease}
                                    >
                                        +
                                    </button>
                                </div>
                            ) : (
                                <button className="btn btn-primary" onClick={handleAddToCart}>
                                    <i className="fas fa-shopping-cart"></i> Add to Cart
                                </button>
                            )}
                            <button className="btn btn-success" onClick={handleBuyNow}>
                                <i className="fas fa-money-bill-wave"></i> Buy Now
                            </button>
                        </div>
                    </div>
                    <div className="product-image">
                        <img src={product.image} alt={product.title} />
                    </div>
                </div>
            </div>
            <div className="product-reviews">
                <h2 className="review-heading">Customer Reviews</h2>
                <form className="review-form" onSubmit={handleReviewSubmit}>
                    <input
                        type="text"
                        placeholder="Your name"
                        value={newReview.username}
                        readOnly={!!currentUser?.displayName}
                        onChange={(e) => {
                            if (!currentUser) {
                                setNewReview({ ...newReview, username: e.target.value });
                            }
                        }}
                        className={currentUser?.displayName ? 'input-readonly' : ''}
                        required
                    />
                    <select
                        value={newReview.rating}
                        onChange={(e) =>
                            setNewReview({ ...newReview, rating: e.target.value })
                        }
                    >
                        {[5, 4, 3, 2, 1].map((r) => (
                            <option key={r} value={r}>
                                {r} Star{r > 1 ? 's' : ''}
                            </option>
                        ))}
                    </select>
                    <textarea
                        placeholder="Write your review..."
                        value={newReview.text}
                        onChange={(e) =>
                            setNewReview({ ...newReview, text: e.target.value })
                        }
                        required
                    />
                    <button type="submit">Submit Review</button>
                </form>

                {reviews.length === 0 && <p>No reviews yet.</p>}
                {reviews.map((r) => (
                    <div key={r.id} className="review">
                        <div className="review-header">
                            <div className="review-stars">{"⭐".repeat(r.rating)}</div>
                            {currentUser && r.userId === currentUser.uid && (
                                <button
                                    className="review-delete-btn"
                                    onClick={() => handleDeleteReview(r.id)}
                                    title="Delete my review"
                                >
                                    <FaTrash />
                                </button>
                            )}
                        </div>
                        <div className="review-text">"{r.text}"</div>
                        <div className="review-user">– {r.username}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductPage;
