// js/toast.js — Zamonaviy Toast Notification (burchakda chiqadi)
function showToast(message, type = 'success', duration = 5000) {
    const container = document.getElementById('toastContainer');
    if (!container) return console.error('toastContainer topilmadi!');

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: 'Checkmark',
        error: 'Cross',
        info: 'Info',
        warning: 'Warning'
    };

    toast.innerHTML = `
        <div class="toast-icon">${icons[type] || 'Info'}</div>
        <div class="toast-message">${message}</div>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;

    container.appendChild(toast);

    // Avto yopish
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.5s ease forwards';
        setTimeout(() => toast.remove(), 600);
    }, duration);
}

// Global qilish (barcha fayllardan foydalanish uchun)
window.showToast = showToast;