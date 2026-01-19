/* ===========================
   SCROLL ANIMATIONS
   =========================== */

class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
    }

    setupIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Opcional: dejar de observar después de activar
                    // observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observar todos los elementos con clases de reveal
        document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up').forEach(el => {
            observer.observe(el);
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new ScrollAnimations();
});
