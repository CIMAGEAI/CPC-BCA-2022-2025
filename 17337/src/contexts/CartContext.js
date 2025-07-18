import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../authContext'; 
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    const saveCartToFirestore = useCallback(async (cart) => {
        if (!currentUser) return; 
        try {
            const cartRef = doc(db, 'carts', currentUser.uid);
            await setDoc(cartRef, { items: cart, updatedAt: new Date() });
        } catch (error) {
            console.error("Error saving cart to Firestore:", error);
        }
    }, [currentUser]);

    useEffect(() => {
        const loadCart = async () => {
            setLoading(true);
            if (currentUser) {
                const cartRef = doc(db, 'carts', currentUser.uid);
                const cartSnap = await getDoc(cartRef);
                if (cartSnap.exists()) {
                    setCartItems(cartSnap.data().items || []);
                } else {
                    setCartItems([]); 
                }
            } else {
                setCartItems([]);
            }
            setLoading(false);
        };

        loadCart();
    }, [currentUser, saveCartToFirestore]);

    const updateCart = (newCart) => {
        setCartItems(newCart);
        saveCartToFirestore(newCart);
    };

    const addToCart = (product) => {
        const existingItem = cartItems.find(item => item.id === product.id);
        if (existingItem) {
            increaseQuantity(product.id);
        } else {
            const newCart = [...cartItems, { ...product, quantity: 1 }];
            updateCart(newCart);
        }
    };

    const increaseQuantity = (productId) => {
        const newCart = cartItems.map(item =>
            item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
        updateCart(newCart);
    };

    const decreaseQuantity = (productId) => {
        const existingItem = cartItems.find(item => item.id === productId);
        let newCart;
        if (existingItem?.quantity === 1) {
            newCart = cartItems.filter(item => item.id !== productId);
        } else {
            newCart = cartItems.map(item =>
                item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
            );
        }
        updateCart(newCart);
    };

    const removeFromCart = (productId) => {
        const newCart = cartItems.filter(item => item.id !== productId);
        updateCart(newCart);
    };
    
    const clearCart = () => {
        updateCart([]);
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalCost = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, cartCount, addToCart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart, loading, totalCost }}>
            {children}
        </CartContext.Provider>
    );
};
