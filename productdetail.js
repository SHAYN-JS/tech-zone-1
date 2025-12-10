// Mahsulot tafsilotlari funksiyalari

class ProductDetail {
    constructor() {
        this.currentProduct = null;
        this.init();
    }

    init() {
        this.loadProductData();
        this.setupEventListeners();
        this.loadSimilarProducts();
    }

    loadProductData() {
        // URL dan mahsulot ID sini olish
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id') || 'prod-1';
        
        // Mahsulot ma'lumotlarini topish
        const allProducts = [...products.discount, ...products.bestsellers];
        this.currentProduct = allProducts.find(product => product.id === productId);
        
        if (this.currentProduct) {
            this.updateProductDisplay();
        }
    }

    updateProductDisplay() {
        // Asosiy ma'lumotlarni yangilash
        document.title = `${this.currentProduct.name} - TechZone`;
        
        const productName = document.querySelector('.product-header h1');
        if (productName) productName.textContent = this.currentProduct.name;

        // Narxlarni yangilash
        const currentPrice = document.querySelector('.current-price');
        const oldPrice = document.querySelector('.old-price');
        const discountBadge = document.querySelector('.discount-badge');

        if (currentPrice) currentPrice.textContent = `${this.formatPrice(this.currentProduct.price)} so'm`;
        if (oldPrice) oldPrice.textContent = this.currentProduct.oldPrice ? 
            `${this.formatPrice(this.currentProduct.oldPrice)} so'm` : '';
        if (discountBadge) discountBadge.textContent = this.currentProduct.discount ? 
            `-${this.currentProduct.discount}%` : '';

        // Rasmlarni yangilash
        const mainImage = document.getElementById('main-product-image');
        if (mainImage) mainImage.src = this.currentProduct.image;
    }

    setupEventListeners() {
        // Rasmlarni almashtirish
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                thumbnails.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
                
                const mainImage = document.getElementById('main-product-image');
                if (mainImage) {
                    mainImage.src = thumb.src;
                }
            });
        });

        // Miqdor o'zgartirish
        const minusBtn = document.querySelector('.qty-btn.minus');
        const plusBtn = document.querySelector('.qty-btn.plus');
        const qtyInput = document.querySelector('.qty-input');

        if (minusBtn && plusBtn && qtyInput) {
            minusBtn.addEventListener('click', () => {
                let value = parseInt(qtyInput.value) || 1;
                if (value > 1) {
                    qtyInput.value = value - 1;
                }
            });

            plusBtn.addEventListener('click', () => {
                let value = parseInt(qtyInput.value) || 1;
                qtyInput.value = value + 1;
            });
        }

        // Savatga qo'shish
        const addToCartBtn = document.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                this.addToCart();
            });
        }

        // Hozir sotib olish
        const buyNowBtn = document.querySelector('.buy-now-btn');
        if (buyNowBtn) {
            buyNowBtn.addEventListener('click', () => {
                this.buyNow();
            });
        }

        // Tab'larni boshqarish
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                this.switchTab(tabId);
            });
        });

        // Reyting berish
        const stars = document.querySelectorAll('.star-rating .star');
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const rating = parseInt(star.dataset.rating);
                this.setRating(stars, rating);
            });
        });
    }

    addToCart() {
        const quantity = parseInt(document.querySelector('.qty-input').value) || 1;
        
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.id === this.currentProduct.id);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: this.currentProduct.id,
                quantity: quantity,
                addedAt: new Date().toISOString()
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Bildirishnoma
        showNotification(`"${this.currentProduct.name}" savatga qo'shildi!`);
        
        // Savat sonini yangilash
        this.updateCartCount();
    }

    buyNow() {
        this.addToCart();
        // To'lov sahifasiga o'tish
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 1000);
    }

    switchTab(tabId) {
        // Tab tugmalarini yangilash
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });

        // Kontentni yangilash
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            content.classList.toggle('active', content.id === tabId);
        });
    }

    setRating(stars, rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    loadSimilarProducts() {
        const similarContainer = document.getElementById('similar-products');
        if (!similarContainer || !this.currentProduct) return;

        // Shunga o'xshash mahsulotlarni topish
        const allProducts = [...products.discount, ...products.bestsellers];
        const similarProducts = allProducts
            .filter(product => 
                product.category === this.currentProduct.category && 
                product.id !== this.currentProduct.id
            )
            .slice(0, 4);

        // Sahifaga yuklash
        similarContainer.innerHTML = similarProducts
            .map(product => createProductCard(product))
            .join('');
    }

    formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
        });
    }
}

// Mahsulot tafsilotlarini ishga tushirish
document.addEventListener('DOMContentLoaded', () => {
    new ProductDetail();
});
showToast('Mahsulot savatga qo\'shildi!', 'success');