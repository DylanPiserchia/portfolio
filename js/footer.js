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
                        <a href="https://www.linkedin.com/in/dylan-ian-piserchia/" target="_blank" title="LinkedIn">
                            <i class="fab fa-linkedin"></i>
                        </a>
                    </div>
                    <div class="footer-actions">
                        <button id="resetLevelBtn" class="btn-reset-level" title="Reiniciar el progreso del nivel">
                            <i class="fas fa-redo"></i> Reset Level
                        </button>
                    </div>
                    <p>&copy; 2026 Dylan Piserchia. Game Design Portfolio.</p>
                </div>
            </footer>
        `;

        const placeholder = document.getElementById('footer-placeholder');
        if (placeholder) {
            placeholder.innerHTML = footerHTML;
            this.footer = document.querySelector('footer');
            this.attachResetButtonListener();
        }
    }

    attachResetButtonListener() {
        const resetBtn = document.getElementById('resetLevelBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to reset your level? All your progress will be lost.')) {
                    localStorage.removeItem('portfolio_data');
                    location.reload();
                }
            });
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new Footer();
});
