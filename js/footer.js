/* ===========================
   FOOTER COMPONENT
   =========================== */

class Footer {
    constructor() {
        this.footer = null;
        this.init();
    }

    init() {
        this.createFooter();
    }

    createFooter() {
        const footerHTML = `
            <footer>
                <div class="container">
                    <div class="footer-social">
                        <a href="https://linkedin.com" target="_blank" title="LinkedIn">
                            <i class="fab fa-linkedin"></i>
                        </a>
                        <a href="https://twitter.com" target="_blank" title="Twitter">
                            <i class="fab fa-twitter"></i>
                        </a>
                        <a href="https://github.com" target="_blank" title="GitHub">
                            <i class="fab fa-github"></i>
                        </a>
                    </div>
                    <p>&copy; 2026 Dylan Piserchia. Game Design Portfolio.</p>
                </div>
            </footer>
        `;

        const placeholder = document.getElementById('footer-placeholder');
        if (placeholder) {
            placeholder.innerHTML = footerHTML;
            this.footer = document.querySelector('footer');
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new Footer();
});
