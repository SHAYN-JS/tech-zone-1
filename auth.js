// Auth JavaScript fayli
class AuthManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupPasswordStrength();
    }

    setupEventListeners() {
        // Form submit
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        // Real-time password strength
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            passwordInput.addEventListener('input', () => {
                this.updatePasswordStrength(passwordInput.value);
            });
        }

        // Password confirmation check
        const confirmPassword = document.getElementById('confirmPassword');
        if (confirmPassword) {
            confirmPassword.addEventListener('input', () => {
                this.checkPasswordMatch();
            });
        }
    }

    setupPasswordStrength() {
        const passwordStrength = document.getElementById('passwordStrength');
        if (passwordStrength) {
            passwordStrength.innerHTML = `
                <div class="strength-bar">
                    <div class="strength-bar-fill"></div>
                </div>
                <span class="strength-text">Parol kuchi</span>
            `;
        }
    }

    updatePasswordStrength(password) {
        const strengthElement = document.getElementById('passwordStrength');
        if (!strengthElement) return;

        let strength = 0;
        let feedback = '';

        // Parol uzunligi
        if (password.length >= 8) strength += 1;
        
        // Katta harf
        if (/[A-Z]/.test(password)) strength += 1;
        
        // Kichik harf
        if (/[a-z]/.test(password)) strength += 1;
        
        // Raqam
        if (/[0-9]/.test(password)) strength += 1;
        
        // Maxsus belgi
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;

        // Strength classification
        strengthElement.className = 'password-strength';
        
        if (password.length === 0) {
            strengthElement.classList.add('strength-weak');
            feedback = 'Parol kuchi';
        } else if (strength <= 2) {
            strengthElement.classList.add('strength-weak');
            feedback = 'Zaif';
        } else if (strength <= 4) {
            strengthElement.classList.add('strength-medium');
            feedback = 'O\'rtacha';
        } else {
            strengthElement.classList.add('strength-strong');
            feedback = 'Kuchli';
        }

        const strengthText = strengthElement.querySelector('.strength-text');
        if (strengthText) {
            strengthText.textContent = feedback;
        }
    }

    checkPasswordMatch() {
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        
        if (!password || !confirmPassword) return;

        if (confirmPassword.value && password.value !== confirmPassword.value) {
            confirmPassword.style.borderColor = 'var(--danger)';
        } else {
            confirmPassword.style.borderColor = 'var(--border)';
        }
    }

    handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        if (!this.validateEmail(email)) {
            this.showAuthError('Iltimos, to\'g\'ri email manzil kiriting');
            return;
        }

        if (!password) {
            this.showAuthError('Iltimos, parol kiriting');
            return;
        }

        // Mock login - haqiqiy loyihada serverga so'rov
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            this.loginSuccess(user);
        } else {
            this.showAuthError('Email yoki parol noto\'g\'ri');
        }
    }

    handleRegister() {
        const formData = this.getRegisterFormData();
        
        if (!this.validateRegisterForm(formData)) {
            return;
        }

        // Mock registration - haqiqiy loyihada serverga so'rov
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        if (users.find(u => u.email === formData.email)) {
            this.showAuthError('Bu email allaqachon ro\'yxatdan o\'tgan');
            return;
        }

        const newUser = {
            id: Date.now(),
            ...formData,
            createdAt: new Date().toISOString(),
            role: 'user'
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        this.registerSuccess(newUser);
    }

    getRegisterFormData() {
        return {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            password: document.getElementById('password').value
        };
    }

    validateRegisterForm(data) {
        if (!data.firstName || !data.lastName) {
            this.showAuthError('Iltimos, ism va familiyangizni kiriting');
            return false;
        }

        if (!this.validateEmail(data.email)) {
            this.showAuthError('Iltimos, to\'g\'ri email manzil kiriting');
            return false;
        }

        if (!this.validatePhone(data.phone)) {
            this.showAuthError('Iltimos, to\'g\'ri telefon raqam kiriting');
            return false;
        }

        if (data.password.length < 8) {
            this.showAuthError('Parol kamida 8 ta belgidan iborat bo\'lishi kerak');
            return false;
        }

        const confirmPassword = document.getElementById('confirmPassword').value;
        if (data.password !== confirmPassword) {
            this.showAuthError('Parollar mos kelmadi');
            return false;
        }

        const terms = document.getElementById('terms');
        if (!terms.checked) {
            this.showAuthError('Iltimos, foydalanish shartlariga rozilik bering');
            return false;
        }

        return true;
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePhone(phone) {
        const phoneRegex = /^\+998\d{9}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    loginSuccess(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Sahifani yangilash yoki bosh sahifaga yo'naltirish
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        
        this.showAuthSuccess('Muvaffaqiyatli kirildi!');
    }

    registerSuccess(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Sahifani yangilash yoki bosh sahifaga yo'naltirish
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        
        this.showAuthSuccess('Muvaffaqiyatli ro\'yxatdan o\'tildi!');
    }

    showAuthError(message) {
        this.showAuthMessage(message, 'error');
    }

    showAuthSuccess(message) {
        this.showAuthMessage(message, 'success');
    }

    showAuthMessage(message, type) {
        // Soddalashtirilgan bildirishnoma
        alert(message);
        
        // Haqiqiy loyihada chiroyli bildirishnoma komponenti ishlatiladi
        console.log(`${type.toUpperCase()}: ${message}`);
    }
}

// Auth manager ni ishga tushirish
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});
showToast('Parollar mos kelmadi!', 'error');
showToast('Muvaffaqiyatli ro\'yxatdan o\'tdingiz!', 'success');