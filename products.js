// Products page JavaScript
class ProductsManager {
    constructor() {
        this.currentView = 'grid';
        this.filters = {
            priceRange: [0, 25000000],
            brands: [],
            categories: [],
            status: []
        };
        this.sortBy = 'popular';
        this.currentPage = 1;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadProducts();
        this.setupViewToggle();
    }

    setupEventListeners() {
        // Narx slider
        const priceSlider = document.getElementById('priceSlider');
        if (priceSlider) {
            priceSlider.addEventListener('input', (e) => {
                this.filters.priceRange[1] = parseInt(e.target.value);
                this.updatePriceDisplay();
            });
        }

        // Saralash
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortBy = e.target.value;
                this.applyFilters();
            });
        }

        // Filtr checkbox'lari
        document.addEventListener('change', (e) => {
            if (e.target.name === 'brand' || e.target.name === 'category' || e.target.name === 'status') {
                this.handleFilterChange(e.target);
            }
        });
    }

    setupViewToggle() {
        const viewBtns = document.querySelectorAll('.view-btn');
        viewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;
                this.switchView(view);
                
                viewBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    switchView(view) {
        this.currentView = view;
        const productsContainer = document.getElementById('productsContainer');
        
        if (productsContainer) {
            productsContainer.className = `products-list ${view}-view`;
        }
    }

    handleFilterChange(checkbox) {
        const filterType = checkbox.name;
        const value = checkbox.value;

        if (checkbox.checked) {
            this.filters[filterType + 's'].push(value);
        } else {
            this.filters[filterType + 's'] = this.filters[filterType + 's']
                .filter(item => item !== value);
        }
    }

    updatePriceDisplay() {
        const maxPriceElement = document.getElementById('maxPrice');
        if (maxPriceElement) {
            maxPriceElement.textContent = this.formatPrice(this.filters.priceRange[1]) + ' so\'m';
        }
    }

    applyFilters() {
        this.loadProducts();
    }

    resetFilters() {
        // Barcha filtrlarni tozalash
        this.filters = {
            priceRange: [0, 25000000],
            brands: [],
            categories: [],
            status: []
        };

        // Checkbox'larni tozalash
        document.querySelectorAll('.filter-option input').forEach(checkbox => {
            checkbox.checked = false;
        });

        // Slider ni qaytarish
        const priceSlider = document.getElementById('priceSlider');
        if (priceSlider) {
            priceSlider.value = 25000000;
            this.updatePriceDisplay();
        }

        // Saralashni qaytarish
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.value = 'popular';
            this.sortBy = 'popular';
        }

        this.loadProducts();
    }

    loadProducts() {
        const container = document.getElementById('productsContainer');
        if (!container) return;

        // Barcha mahsulotlarni olish
        const allProducts = [...window.app.products.discount, ...window.app.products.bestsellers];
        
        // Filtrlash
        let filteredProducts = this.filterProducts(allProducts);
        
        // Saralash
        filteredProducts = this.sortProducts(filteredProducts);

        // Sahifaga yuklash
        if (filteredProducts.length === 0) {
            container.innerHTML = this.getEmptyStateHTML();
        } else {
            container.innerHTML = filteredProducts
                .map(product => window.app.createProductCard(product))
                .join('');
        }
    }

    filterProducts(products) {
        return products.filter(product => {
            // Narx bo'yicha filtrlash
            if (product.price < this.filters.priceRange[0] || product.price > this.filters.priceRange[1]) {
                return false;
            }

            // Brend bo'yicha filtrlash
            if (this.filters.brands.length > 0 && !this.filters.brands.includes(product.brand.toLowerCase())) {
                return false;
            }

            // Kategoriya bo'yicha filtrlash
            if (this.filters.categories.length > 0 && !this.filters.categories.includes(product.category)) {
                return false;
            }

            // Holat bo'yicha filtrlash
            if (this.filters.status.length > 0 && !this.filters.status.includes(product.status?.toLowerCase())) {
                return false;
            }

            return true;
        });
    }

    sortProducts(products) {
        switch (this.sortBy) {
            case 'price-low':
                return products.sort((a, b) => a.price - b.price);
            case 'price-high':
                return products.sort((a, b) => b.price - a.price);
            case 'new':
                return products.sort((a, b) => new Date(b.addedDate || 0) - new Date(a.addedDate || 0));
            case 'discount':
                return products.filter(p => p.discount > 0)
                    .sort((a, b) => b.discount - a.discount);
            default:
                return products; // Mashhurlik bo'yicha
        }
    }

    getEmptyStateHTML() {
        return `
            <div class="empty-products">
                <div class="icon">🔍</div>
                <h3>Mahsulot topilmadi</h3>
                <p>Filtr shartlariga mos keladigan mahsulot topilmadi. Iltimos, boshqa filtrlarni sinab ko'ring.</p>
                <button class="btn" onclick="productsManager.resetFilters()" style="margin-top: 20px;">
                    Filtrlarni tozalash
                </button>
            </div>
        `;
    }

    formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
}

// Products manager ni ishga tushirish
document.addEventListener('DOMContentLoaded', () => {
    window.productsManager = new ProductsManager();
});