// js/main.js - TechZone asosiy JavaScript fayli (2025-yil yangilangan)

class TechZoneApp {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.products = this.getProducts();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCartCount();
        this.updateAuthUI();
        this.loadProducts();

        if (document.getElementById('productsContainer')) {
            this.setupProductsPage();
        }

        this.startCountdownTimer();
    }

    // Mahsulotlar ma'lumotlari
    getProducts() {
        return {
            // *** AKSIYA Mahsulotlari (Discount) - YANGI MAHSULOT QO'SHILDI ***
            discount: [
                {
                    id: 'prod-rtx4070ti', // YANGI ID
                    name: 'ASUS TUF RTX 4070 Ti OC',
                    brand: 'ASUS',
                    specs: '12GB GDDR6X, 3 fan, RGB',
                    price: 12500000,
                    oldPrice: 15000000,
                    discount: 17,
                    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    category: 'gpu',
                    addedDate: '2025-11-25'
                },
                {
                    id: 'prod-1',
                    name: 'Lenovo Legion 5 Pro (2024)',
                    brand: 'Lenovo',
                    specs: 'Ryzen 7 7840HS, RTX 4060, 16GB RAM, 1TB SSD',
                    price: 18000000,
                    oldPrice: 21000000,
                    discount: 14,
                    image: 'https://images.unsplash.com/photo-1629131616788-cd4c570b5d84?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    category: 'laptops',
                    addedDate: '2025-11-20'
                },
                {
                    id: 'prod-2',
                    name: 'Samsung Odyssey G9 49-inch',
                    brand: 'Samsung',
                    specs: 'Ultrawide, 240Hz, 1ms, QLED',
                    price: 14500000,
                    oldPrice: 16000000,
                    discount: 9,
                    image: 'https://images.unsplash.com/photo-1606248838332-94b3c9d74917?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    category: 'monitors',
                    addedDate: '2025-11-15'
                }
                // ... boshqa aksiya mahsulotlari ...
            ],
            
            // *** ENG KO'P SOTILAYOTGANLAR (Bestsellers) - 3 ta YANGI MAHSULOT QO'SHILDI ***
            bestsellers: [
                {
                    id: 'prod-4',
                    name: 'Logitech G PRO X Superlight',
                    brand: 'Logitech',
                    specs: 'Wireless, 63g, HERO sensor',
                    price: 2800000,
                    image: 'https://images.unsplash.com/photo-1616766436940-d66838a6a6f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    category: 'keyboard-mouse',
                    addedDate: '2025-12-01'
                },
                {
                    id: 'prod-5', // YANGI
                    name: 'AMD Ryzen 9 7950X3D',
                    brand: 'AMD',
                    specs: '16 Core, 32 Thread, 3D V-Cache',
                    price: 7500000,
                    image: 'https://images.unsplash.com/photo-1627916694665-22312d6a36a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    category: 'desktops',
                    addedDate: '2025-12-05'
                },
                {
                    id: 'prod-6', // YANGI
                    name: 'Crucial 32GB DDR5 RAM (2x16)',
                    brand: 'Crucial',
                    specs: '6000MHz, CL30, RGB',
                    price: 3200000,
                    image: 'https://images.unsplash.com/photo-1611721522501-edb120c43916?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    category: 'rams',
                    addedDate: '2025-12-05'
                },
                {
                    id: 'prod-3',
                    name: 'Dell XPS 13 (9340)',
                    brand: 'Dell',
                    specs: 'Core Ultra 7, 32GB RAM, 1TB SSD',
                    price: 25000000,
                    image: 'https://images.unsplash.com/photo-1541807062-8e7c1f7b0b2e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    category: 'laptops',
                    addedDate: '2025-11-28'
                },
                // ... boshqa eng ko'p sotilayotgan mahsulotlar ...
            ]
        };
    }
    
    // Barcha mahsulotlarni birlashtiradi
    getAllProducts() {
        return [...this.products.discount, ...this.products.bestsellers];
    }
    
    // Mahsulot kartasi uchun HTML generatsiya qilish
    createProductCard(product) {
        const oldPriceHtml = product.oldPrice ? `<span class="old-price">${this.formatPrice(product.oldPrice)} so'm</span>` : '';
        const discountBadge = product.discount ? `<div class="discount-badge">-${product.discount}%</div>` : '';

        return `
            <a href="product.html?id=${product.id}" class="product-card">
                ${discountBadge}
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                </div>
                <h4 class="product-name">${product.name}</h4>
                <p class="product-specs">${product.specs}</p>
                <div class="product-prices">
                    ${oldPriceHtml}
                    <span class="current-price">${this.formatPrice(product.price)} so'm</span>
                </div>
                <div class="product-actions">
                    <button class="btn btn-primary" data-id="${product.id}" onclick="event.preventDefault(); app.addToCart('${product.id}')">
                        Savatga
                    </button>
                    <button class="btn btn-secondary">
                        ❤
                    </button>
                </div>
            </a>
        `;
    }

    // Bosh sahifadagi mahsulotlarni yuklash
    loadProducts() {
        // Aksiya mahsulotlari
        const discountContainer = document.getElementById('discountProducts');
        if (discountContainer) {
            discountContainer.innerHTML = this.products.discount.slice(0, 4).map(product => this.createProductCard(product)).join('');
        }

        // Eng ko'p sotilayotganlar
        const bestsellerContainer = document.getElementById('bestsellerProducts');
        if (bestsellerContainer) {
            bestsellerContainer.innerHTML = this.products.bestsellers.slice(0, 8).map(product => this.createProductCard(product)).join('');
        }
    }
    
    // Savatga mahsulot qo'shish
    addToCart(productId) {
        const product = this.getAllProducts().find(p => p.id === productId);
        if (!product) return showToast('Mahsulot topilmadi!', 'error');

        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ id: productId, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartCount();
        showToast(`"${product.name}" savatga qo'shildi!`, 'success');
    }

    // Savatdagi narsalar sonini yangilash (Header uchun)
    updateCartCount() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountElements = document.querySelectorAll('.cart-count');
        
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
        });
    }

    setupEventListeners() {
        // ... (Boshqa event listenerlar) ...
        
        // Qidiruv funksiyasini qo'shish (Index sahifasi)
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = searchInput.value.trim();
                    if (query) {
                        window.location.href = `products.html?search=${encodeURIComponent(query)}`;
                    }
                }
            });
        }
    }

    updateAuthUI() {
        const authButtonsDiv = document.getElementById('authButtons');
        if (!authButtonsDiv) return;

        if (this.currentUser) {
            // Agar foydalanuvchi kirgan bo'lsa
            authButtonsDiv.innerHTML = `
                <div class="user-profile">
                    <button class="btn btn-user">${this.currentUser.firstName}</button>
                    <button class="btn btn-logout" onclick="app.logout()">Chiqish</button>
                </div>
            `;
        } else {
            // Agar foydalanuvchi kirmagan bo'lsa
            authButtonsDiv.innerHTML = `
                <a href="login.html" class="btn">Kirish</a>
                <a href="register.html" class="btn">Ro'yxatdan o'tish</a>
            `;
        }
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        this.updateAuthUI();
        showToast('Tizimdan chiqildi!', 'info');
        // Sahifani yangilash
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }

    startCountdownTimer() {
        const timerElement = document.getElementById('discountTimer');
        if (!timerElement) return;

        const endTime = new Date();
        endTime.setDate(endTime.getDate() + 3);
        endTime.setHours(endTime.getHours() + 12);

        const updateTimer = () => {
            const now = new Date();
            const timeLeft = endTime - now;

            if (timeLeft <= 0) {
                timerElement.textContent = "Aksiya tugadi!";
                return;
            }

            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

            timerElement.textContent = `Vaqt qoldi: ${days} kun ${hours} soat ${minutes} daqiqa`;
        };

        updateTimer();
        setInterval(updateTimer, 60000);
    }

    formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    // Foydalanuvchi chiqishi
    // Eslatma: Ushbu kodda qo'shimcha funksiyalar (masalan, tovarlarni saralash, filtrlash)
    // boshqa fayllarga (products.js, category.js) ajratilgan.

}

// Global qilish (boshqa JS fayllardan foydalanish uchun)
window.app = new TechZoneApp();
window.products = window.app.products; // Mahsulotlar ma'lumotlarini global qilib qo'yish


