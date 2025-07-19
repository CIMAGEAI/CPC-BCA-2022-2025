// JavaScript for Cosmetic Store E-commerce

// Cart functionality
let cartCount = 0;

// Function to add product to cart
function addToCart() {
    cartCount++;
    updateCartCount();
    alert("Item added to cart!");
}

// Function to update cart count display
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    cartCountElement.textContent = cartCount;
}

// Event listeners for add to cart buttons
const addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach(button => {
    button.addEventListener('click', addToCart);
});
