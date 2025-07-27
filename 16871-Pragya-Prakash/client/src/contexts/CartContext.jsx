import { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

const initialState = {
  items: (() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  })(),
  total: 0,
  itemCount: 0
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => 
        item.product._id === action.payload.product._id &&
        (!action.payload.variant || item.variant?.name === action.payload.variant?.name)
      );

      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.product._id === action.payload.product._id &&
          (!action.payload.variant || item.variant?.name === action.payload.variant?.name)
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
        
        const newState = {
          ...state,
          items: updatedItems
        };
        
        // Calculate totals
        newState.itemCount = newState.items.reduce((sum, item) => sum + item.quantity, 0);
        newState.total = newState.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        return newState;
      } else {
        const newState = {
          ...state,
          items: [...state.items, action.payload]
        };
        
        // Calculate totals
        newState.itemCount = newState.items.reduce((sum, item) => sum + item.quantity, 0);
        newState.total = newState.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        return newState;
      }

    case 'UPDATE_QUANTITY':
      const updatedItems = state.items.map(item =>
        item.product._id === action.payload.productId &&
        (!action.payload.variant || item.variant?.name === action.payload.variant?.name)
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);

      const newState = {
        ...state,
        items: updatedItems
      };
      
      // Calculate totals
      newState.itemCount = newState.items.reduce((sum, item) => sum + item.quantity, 0);
      newState.total = newState.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return newState;

    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(item =>
        !(item.product._id === action.payload.productId &&
          (!action.payload.variant || item.variant?.name === action.payload.variant?.name))
      );

      const removeState = {
        ...state,
        items: filteredItems
      };
      
      // Calculate totals
      removeState.itemCount = removeState.items.reduce((sum, item) => sum + item.quantity, 0);
      removeState.total = removeState.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return removeState;

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0,
        itemCount: 0
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(state.items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [state.items]);

  // Add item to cart
  const addToCart = (product, quantity = 1, variant = null) => {
    const item = {
      product: {
        _id: product._id,
        name: product.name,
        price: product.price,
        mainImage: product.mainImage,
        stock: product.stock
      },
      quantity,
      price: product.price,
      variant
    };

    dispatch({ type: 'ADD_ITEM', payload: item });
    toast.success(`${product.name} added to cart!`);
  };

  // Update item quantity
  const updateQuantity = (productId, quantity, variant = null) => {
    if (quantity <= 0) {
      removeFromCart(productId, variant);
      return;
    }

    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { productId, quantity, variant }
    });
  };

  // Remove item from cart
  const removeFromCart = (productId, variant = null) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: { productId, variant }
    });
    toast.success('Item removed from cart');
  };

  // Clear cart
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast.success('Cart cleared');
  };

  // Get cart item
  const getCartItem = (productId, variant = null) => {
    return state.items.find(item =>
      item.product._id === productId &&
      (!variant || item.variant?.name === variant?.name)
    );
  };

  // Check if item is in cart
  const isInCart = (productId, variant = null) => {
    return state.items.some(item =>
      item.product._id === productId &&
      (!variant || item.variant?.name === variant?.name)
    );
  };

  const value = {
    items: state.items,
    total: state.total,
    itemCount: state.itemCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartItem,
    isInCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 