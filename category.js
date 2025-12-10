// Kategoriya sahifasi funksiyalari

class CategoryPage {
    constructor() {
        this.currentCategory = '';
        this.filters = {
            priceRange: [0, 50000000],
            brands: [],
            processors: [],
            gpus: [],
            rams: []
        };
        this.sortBy = 'popular';
        this.currentPage = 1;
        this.init();
    }

    init() {
        this.detectCategory();
        this.setupEventListeners();
        this.loadProducts();
    }

    detectCategory() {
        const urlParams = new URLSearchParams(window.location.search);
        this.currentCategory = urlParams.get('type') || 'laptops';
        
        // Sahifa sarlavhasini yangilash
        const categoryTitles = {
            'laptops': 'Noutbuklar',
            'desktops': 'Sistem bloklar',
            'monitors': 'Monitorlar',
            'gpu': 'Videokartalar',
            'storage': 'SSD va HDD',
            'keyboard-mouse': 'Klaviatura va Sichqoncha',
            'peripherals': 'Periferiya'
        };

        const pageTitle = document.querySelector('.products-header h1');
        if (pageTitle) {
            pageTitle.textContent = categoryTitles[this.currentCategory] || 'Mahsulotlar';
        }

        document.title = `${categoryTitles[this.currentCategory]} - TechZone`;
    }

    setupEventListeners() {
        // Narx slider
        const priceSlider = document.querySelector('.price-slider');
        if (priceSlider) {
            priceSlider.addEventListener('input', (e) => {
                this.filters.priceRange[1] = parseInt(e.target.value);
                this.updatePriceDisplay();
            });
        }

        // Filtr checkbox'lari
        const checkboxes = document.querySelectorAll('.filter-checkbox input');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.handleFilterChange(e.target);
            });
        });

        // Saralash
        const sortSelect = document.querySelector('.sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortBy = e.target.value;
                this.loadProducts();
            });
        }

        // Filtrlarni qo'llash
        const applyFiltersBtn = document.querySelector('.apply-filters');
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => {
                this.applyFilters();
            });
        }

        // Filtrlarni tozalash
        const resetFiltersBtn = document.querySelector('.reset-filters');
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', () => {
                this.resetFilters();
            });
        }

        // Pagination
        const pageBtns = document.querySelectorAll('.page-btn');
        pageBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (e.target.classList.contains('next')) {
                    this.currentPage++;
                } else if (!isNaN(parseInt(e.target.textContent))) {
                    this.currentPage = parseInt(e.target.textContent);
                }
                this.loadProducts();
            });
        });
    }

    handleFilterChange(checkbox) {
        const filterType = checkbox.name;
        const value = checkbox.value;

        if (checkbox.checked) {
            this.filters[filterType + 's'].push(value);
        } else {
            this.filters[filterType + 's'] = this.filters[filterType + 's'].filter(item => item !== value);
        }
    }

    updatePriceDisplay() {
        const priceValues = document.querySelector('.price-values span:last-child');
        if (priceValues) {
            priceValues.textContent = `${this.formatPrice(this.filters.priceRange[1])} so'm`;
        }
    }

    applyFilters() {
        this.loadProducts();
    }

    resetFilters() {
        // Barcha filtrlarni tozalash
        this.filters = {
            priceRange: [0, 50000000],
            brands: [],
            processors: [],
            gpus: [],
            rams: []
        };

        // Checkbox'larni tozalash
        const checkboxes = document.querySelectorAll('.filter-checkbox input');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        // Slider ni qaytarish
        const priceSlider = document.querySelector('.price-slider');
        if (priceSlider) {
            priceSlider.value = 25000000;
            this.updatePriceDisplay();
        }

        this.loadProducts();
    }

    loadProducts() {
        const container = document.getElementById('category-products');
        if (!container) return;

        // Barcha mahsulotlarni olish
        const allProducts = [...products.discount, ...products.bestsellers];
        
        // Kategoriya bo'yicha filtrlash
        let filteredProducts = allProducts.filter(product => 
            product.category === this.currentCategory
        );

        // Qo'shimcha filtrlarni qo'llash
        filteredProducts = this.applyAdditionalFilters(filteredProducts);

        // Saralash
        filteredProducts = this.sortProducts(filteredProducts);

        // Sahifaga yuklash
        container.innerHTML = filteredProducts
            .map(product => createProductCard(product))
            .join('');

        // Pagination yangilash
        this.updatePagination(filteredProducts.length);
    }

    applyAdditionalFilters(products) {
        return products.filter(product => {
            // Narx bo'yicha filtrlash
            if (product.price < this.filters.priceRange[0] || product.price > this.filters.priceRange[1]) {
                return false;
            }

            // Brend bo'yicha filtrlash
            if (this.filters.brands.length > 0 && !this.filters.brands.includes(product.brand.toLowerCase())) {
                return false;
            }

            // Boshqa filtrlarni qo'llash...
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
                return products.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
            default:
                return products; // Mashhurlik bo'yicha
        }
    }

    updatePagination(totalProducts) {
        const productsPerPage = 12;
        const totalPages = Math.ceil(totalProducts / productsPerPage);
        
        // Pagination logikasi
        // (Soddalik uchun bu qismni siz to'ldirishingiz mumkin)
    }

    formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
}

// Kategoriya sahifasini ishga tushirish
document.addEventListener('DOMContentLoaded', () => {
    new CategoryPage();
});