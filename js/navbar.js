/* ===========================
   NAVBAR COMPONENT
   =========================== */

class Navbar {
    constructor() {
        this.nav = null;
        this.isInPages = false; // Flag para detectar si estamos en pages/
        this.init();
    }

    init() {
        this.detectLocation();
        this.createNavbar();
        this.attachEventListeners();
        this.setupActiveLink();
    }

    // Detectar si estamos en pages/ folder
    detectLocation() {
        const pathname = window.location.pathname;
        this.isInPages = pathname.includes('/pages/');
    }

    // Obtener ruta correcta según ubicación
    getPath(page) {
        const pathname = window.location.pathname;
        const isInPages = pathname.includes('/pages/');
        
        if (page === 'home') {
            // Todos los archivos están en pages/, así que siempre devolvemos index.html
            return isInPages ? 'index.html' : 'pages/index.html';
        } else if (page === 'about') {
            return isInPages ? 'about.html' : 'pages/about.html';
        }
        return page;
    }

    createNavbar() {
        const homeLink = this.getPath('home');
        const aboutLink = this.getPath('about');
        
        // Determinar el link de Projects
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        let projectsLink;
        
        if (currentPage === 'index.html') {
            // Si estamos en index.html, hacer scroll a #projects en la misma página
            projectsLink = '#projects';
        } else {
            // Si no estamos en index.html, ir a index.html#projects
            projectsLink = this.isInPages ? 'index.html#projects' : 'pages/index.html#projects';
        }

        const navHTML = `
            <nav>
                <div class="nav-container">
                    <a href="${homeLink}" class="nav-brand">Dylan Piserchia</a>
                    <button class="nav-toggle" id="navToggle">
                        <i class="fas fa-bars"></i>
                    </button>
                    <ul class="nav-links" id="navLinks">
                        <li><a href="${homeLink}">Home</a></li>
                        <li><a href="${projectsLink}">Projects</a></li>
                        <li><a href="${aboutLink}">About</a></li>
                    </ul>
                </div>
            </nav>
        `;

        const placeholder = document.getElementById('navbar-placeholder');
        if (placeholder) {
            placeholder.innerHTML = navHTML;
            this.nav = document.querySelector('nav');
        }
    }

    attachEventListeners() {
        const toggle = document.getElementById('navToggle');
        const links = document.getElementById('navLinks');

        if (toggle) {
            toggle.addEventListener('click', () => {
                links.classList.toggle('active');
            });

            // Manejar clicks en links
            links.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    
                    // Si el link contiene un hash (#projects)
                    if (href.includes('#')) {
                        const [page, hash] = href.split('#');
                        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
                        const targetPage = page || currentPage;
                        
                        // Si estamos en la misma página, hacer scroll
                        if (targetPage === currentPage || (targetPage === 'index.html' && currentPage === 'index.html')) {
                            e.preventDefault();
                            const target = document.getElementById(hash);
                            if (target) {
                                target.scrollIntoView({ behavior: 'smooth' });
                            }
                        }
                        // Si no estamos en la misma página, dejar que navegue normalmente
                    }
                    
                    // Cerrar menu en cualquier caso
                    links.classList.remove('active');
                });
            });
        }
    }

    setupActiveLink() {
        const pathname = window.location.pathname;
        const currentPage = pathname.split('/').pop() || 'index.html';
        const links = document.querySelectorAll('.nav-links a');

        links.forEach(link => {
            const href = link.getAttribute('href');
            const hrefPage = href.split('/').pop();
            
            // Comparar páginas
            if (hrefPage === currentPage || (currentPage === 'index.html' && href.includes('index.html'))) {
                link.classList.add('active');
            }
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new Navbar();
});
