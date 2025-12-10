// Savat funksiyalari

class CartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        // products ma'lumoti main.js dan keladi, shu sababli bu yerda mavjud deb hisoblaymiz
        this.init();
    }

    init() {
        this.loadCartItems();
        this.setupEventListeners();
        this.updateCartSummary();
        this.updateCartCount(); // Headerdagi savat sonini yangilash
    }

    loadCartItems() {
        // Savatdagi mahsulotlarni yuklash
        const cartItemsContainer = document.getElementById('cartItemsContainer'); // ID'ni o'zgartirdik
        if (!cartItemsContainer) return;

        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart" style="text-align: center; padding: 50px; grid-column: 1 / -1;">
                    <h3>Savat bo'sh</h3>
                    <p style="margin-bottom: 20px;">Hozircha savatingizda mahsulot yo'q</p>
                    <a href="products.html" class="btn">Mahsulotlar sahifasiga o'tish</a>
                </div>
            `;
            return;
        }

        // Mahsulotlarni sahifaga yuklash
        cartItemsContainer.innerHTML = this.cart.map(item => this.createCartItemHTML(item)).join('');
    }

    createCartItemHTML(item) {
        const product = this.getProductById(item.id);
        if (!product) return '';

        // *** Mahsulotni qo'shish/olib tashlash tugmalari bilan to'liq savat elementi ***
        return `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="item-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="item-details">
                    <a href="product.html?id=${item.id}">
                        <h4 class="item-name">${product.name}</h4>
                    </a>
                    <p class="item-specs">${product.specs || ''}</p>
                </div>
                <div class="item-quantity">
                    <button class="qty-btn remove-one" data-id="${item.id}" onclick="cartManager.changeQuantity('${item.id}', -1)">-</button>
                    <input type="number" min="1" value="${item.quantity}" readonly>
                    <button class="qty-btn add-one" data-id="${item.id}" onclick="cartManager.changeQuantity('${item.id}', 1)">+</button>
                </div>
                <div class="item-price">
                    <span class="current-price">${this.formatPrice(product.price * item.quantity)} so'm</span>
                </div>
                <button class="item-remove" onclick="cartManager.removeItem('${item.id}')">
                    ❌ O'chirish
                </button>
            </div>
        `;
    }

    // Mahsulot miqdorini o'zgartirish
    changeQuantity(productId, amount) {
        const itemIndex = this.cart.findIndex(item => item.id === productId);

        if (itemIndex > -1) {
            const newQuantity = this.cart[itemIndex].quantity + amount;

            if (newQuantity <= 0) {
                // Agar miqdor 0 yoki undan kam bo'lsa, mahsulotni o'chiramiz
                this.removeItem(productId);
            } else {
                this.cart[itemIndex].quantity = newQuantity;
                this.saveCart();
                this.loadCartItems();
                this.updateCartSummary();
                this.updateCartCount();
                showToast(`Mahsulot miqdori ${amount > 0 ? 'oshirildi' : 'kamaytirildi'}!`, 'info');
            }
        }
    }

    // Mahsulotni butunlay o'chirish
    removeItem(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.loadCartItems();
        this.updateCartSummary();
        this.updateCartCount();
        showToast('Mahsulot savatdan olib tashlandi!', 'error');
    }

    setupEventListeners() {
        // Savat sahifasiga oid boshqa voqealarni tinglash
    }

    updateCartSummary() {
        // Jami summani hisoblash
        const subtotal = this.cart.reduce((sum, item) => {
            const product = this.getProductById(item.id);
            return sum + (product ? product.price * item.quantity : 0);
        }, 0);

        const deliveryCost = subtotal > 10000000 ? 0 : 35000; // 10mlndan yuqori bepul
        const total = subtotal + deliveryCost;

        const summaryElements = {
            subtotal: document.getElementById('subtotal'),
            delivery: document.getElementById('deliveryCost'),
            total: document.getElementById('totalPrice')
        };

        if (summaryElements.subtotal) {
            summaryElements.subtotal.textContent = `${this.formatPrice(subtotal)} so'm`;
            summaryElements.delivery.textContent = `${this.formatPrice(deliveryCost)} so'm`;
            summaryElements.total.textContent = `${this.formatPrice(total)} so'm`;
        }
    }

    proceedToCheckout() {
        if (this.cart.length === 0) {
            showToast('Savat bo\'sh!', 'warning');
            return;
        }

        // To'lov sahifasiga o'tish
        alert("To'lov sahifasiga yo'naltirilmoqda...");
        // window.location.href = 'checkout.html';
    }

    getProductById(productId) {
        // Barcha mahsulotlarni birlashtirish (main.js dagi products global o'zgaruvchisidan foydalanish)
        if (window.products) {
            const allProducts = [...window.products.discount, ...window.products.bestsellers];
            return allProducts.find(product => product.id === productId);
        }
        return null;
    }

    formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    updateCartCount() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountElements = document.querySelectorAll('.cart-count');
        
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
        });
    }
}

// Global ishga tushirish
const products = window.products; // main.js dan kelgan products o'zgaruvchisini olish uchun
const cartManager = new CartManager();
window.cartManager = cartManager;