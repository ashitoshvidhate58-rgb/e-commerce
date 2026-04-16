//User clicks "Add to Cart" → addToCart() → Updates cart array → updateCartDisplay() → Saves to localStorage

//Cart icon clicked → toggleCart() → Shows cart sidebar → renderCartItems() displays items with prices

//Checkout button → proceedToCheckout() → Redirects to payment page



// API URL
const API = "http://localhost:3001";

// Cart Management
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

                    // Toast notification                               
// Creates a temporary notification popup that appears for 2 seconds
//Used to show success/error messages like "Product added to cart"

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

                    // Escape HTML
//Security function - prevents XSS attacks by converting special characters (&, <, >) to HTML entities
//Example: <script> becomes &lt;script&gt;

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

                    // Get category icon
//Returns an emoji icon based on product category
//Default: 📦 if category not found

function getCategoryIcon(category) {
    const icons = {
        'Electronics': '📱', 'Clothing': '👕', 'Books': '📚',
        'Sports': '⚽', 'Home': '🏠', 'Beauty': '💄', 'Toys': '🧸'
    };
    return icons[category] || '📦';
}

                    // Render stars
//Converts numeric rating (e.g., 4.2) to star display
//Example: rating 4.2 → "⭐⭐⭐⭐☆ 4.2"

function renderStars(rating) {
    if (!rating) return '⭐ New';
    const full = Math.floor(rating);
    let stars = '⭐'.repeat(full);
    stars += '☆'.repeat(5 - full);
    return `${stars} ${rating.toFixed(1)}`;
}

                    // Cart Functions
//Updates cart badge number, refreshes cart items list, and saves to localStorage
//reduce() calculates total quantity by summing all item quantities
//Saves to localStorage so cart persists after page refresh

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
    renderCartItems();
    localStorage.setItem('cart', JSON.stringify(cart));
}

function renderCartItems() {
    const container = document.getElementById('cartItemsList');
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 2rem; color: #999;">Your cart is empty 🛒</div>';
        const cartTotal = document.getElementById('cartTotal');
        if (cartTotal) cartTotal.textContent = '0';
        return;
    }

    let total = 0;
    container.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-title">${escapeHtml(item.title)}</div>
                    <div class="cart-item-price">₹${item.price}</div>
                </div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button onclick="removeFromCart(${item.id})" style="background: none; border: none; color: #ff4757; cursor: pointer;">🗑️</button>
            </div>
        `;
    }).join('');
    const cartTotal = document.getElementById('cartTotal');
    if (cartTotal) cartTotal.textContent = total;
}

function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartDisplay();
    showToast(`${product.title} added to cart!`);
}

//delta = 1 → increase quantity
//delta = -1 → decrease quantity
//If quantity becomes 0, removes item from cart completely

function updateQuantity(id, delta) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id !== id);
        }
        updateCartDisplay();
    }
}

//Filters out the product with matching id
//Shows removal confirmation toast

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartDisplay();
    showToast('Item removed from cart');
}


//Opens/closes cart sidebar overlay by toggling 'open' CSS class

function toggleCart() {
    const overlay = document.getElementById('cartOverlay');
    if (overlay) {
        overlay.classList.toggle('open');
    }
}


//Validates cart isn't empty
//Saves cart to localStorage
//Redirects to checkout page (addToCart.html)

function proceedToCheckout() {
    if (cart.length === 0) {
        showToast('Cart is empty!', 'error');
        return;
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.location.href = 'addToCart.html';
}

// Initialize cart on page load
if (document.getElementById('cartCount')) {
    updateCartDisplay();
}