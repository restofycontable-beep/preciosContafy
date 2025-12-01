// Plan Selection Functionality
function initPlanSelection() {
    const planButtons = document.querySelectorAll('.plan-btn');
    const selectedPlanInfo = document.getElementById('selected-plan-info');
    const selectedPlanName = document.getElementById('selected-plan-name');
    const selectedPlanDetails = document.getElementById('selected-plan-details');
    
    let selectedPlan = null;
    
    planButtons.forEach(button => {
        button.addEventListener('click', function() {
            const plan = this.getAttribute('data-plan');
            const price = this.getAttribute('data-price');
            const docs = this.getAttribute('data-docs');
            const card = this.closest('.pricing-card');
            
            // Remove previous selection from all cards and buttons
            document.querySelectorAll('.pricing-card').forEach(c => {
                c.classList.remove('border-2', 'border-primary', 'shadow-2xl', 'scale-105', 'transform');
                // Reset all cards to normal state (including recommended plan)
                c.classList.add('border', 'border-gray-200', 'shadow-lg');
                
                // Hide the "Recomendado" badge if it exists
                const badge = c.querySelector('#recommended-badge');
                if (badge) {
                    badge.style.display = 'none';
                }
            });
            
            planButtons.forEach(btn => {
                btn.classList.remove('bg-primary', 'text-white', 'hover:bg-primary-dark');
                btn.classList.add('bg-gray-100', 'text-gray-900', 'hover:bg-gray-200');
                btn.textContent = 'Seleccionar Plan';
            });
            
            // Add selection styling to current card (like the middle one)
            card.classList.remove('border', 'border-gray-200', 'shadow-lg');
            card.classList.add('border-2', 'border-primary', 'shadow-2xl', 'scale-105');
            
            // If selecting the recommended plan, show the badge again
            if (plan === 'intermedio') {
                const badge = card.querySelector('#recommended-badge');
                if (badge) {
                    badge.style.display = 'block';
                }
            }
            
            // Add selection styling to current button (red like middle plan)
            this.classList.remove('bg-gray-100', 'text-gray-900', 'hover:bg-gray-200');
            this.classList.add('bg-primary', 'text-white', 'hover:bg-primary-dark');
            this.textContent = '✓ Plan Seleccionado';
            
            // Update selected plan info
            selectedPlan = { plan, price, docs };
            updateSelectedPlanInfo(plan, price, docs);
            
            // Show success message
            showNotification(`Plan ${plan.charAt(0).toUpperCase() + plan.slice(1)} seleccionado correctamente`, 'success');
        });
    });
    
    function updateSelectedPlanInfo(plan, price, docs) {
        const planNames = {
            'basico': 'Básico',
            'intermedio': 'Intermedio',
            'avanzado': 'Avanzado'
        };
        
        const formattedPrice = new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(price);
        
        selectedPlanName.textContent = planNames[plan];
        selectedPlanDetails.textContent = `${formattedPrice}/mes - ${new Intl.NumberFormat('es-CO').format(docs)} documentos mensuales`;
        selectedPlanInfo.classList.remove('hidden');
        
        // Smooth scroll to show the selection
        selectedPlanInfo.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg max-w-sm transform translate-x-full transition-transform duration-300`;
    
    const colors = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        info: 'bg-blue-500 text-white'
    };
    
    const icons = {
        success: 'check_circle',
        error: 'error',
        info: 'info'
    };
    
    notification.className += ` ${colors[type]}`;
    notification.innerHTML = `
        <div class="flex items-center">
            <span class="material-symbols-outlined mr-2">${icons[type]}</span>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(full)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Card Animation Manager
class CardAnimationManager {
    constructor() {
        this.cards = document.querySelectorAll('.pricing-card');
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.initializeObserver();
    }
    
    initializeObserver() {
        // Only animate if user hasn't requested reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, this.observerOptions);
        
        // Initially hide cards for animation
        this.cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(card);
        });
    }
}

// Utility Functions
class Utils {
    static formatPrice(price) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(price);
    }
    
    static addRippleEffect(element) {
        element.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing all components...');
    
    // Initialize plan selection
    initPlanSelection();
    
    // Initialize card animations
    new CardAnimationManager();
    
    // Add ripple effects to buttons
    const buttons = document.querySelectorAll('button:not(.plan-btn), .btn');
    buttons.forEach(button => {
        Utils.addRippleEffect(button);
    });
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});

// Add CSS for ripple effect and animations
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    button {
        position: relative;
        overflow: hidden;
    }
    
    .notification {
        transition: transform 0.3s ease-in-out;
    }
`;
document.head.appendChild(style);