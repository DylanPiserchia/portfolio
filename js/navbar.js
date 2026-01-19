/* ===========================
   GAMIFICATION LEVEL SYSTEM CONFIG
   =========================== */

const LEVEL_CONFIG = {
    xpPerPage: 25,
    baseXP: 100,
    storageKey: 'portfolio_data'
};

let userStats = {
    xp: 0,
    level: 1,
    visitedPages: []
};

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
        this.loadProgress();
        this.detectLocation();
        this.createNavbar();
        this.attachEventListeners();
        this.setupActiveLink();
        this.checkPageExperience();
        this.setupResumeButton();
    }

    // Cargar progreso desde localStorage
    loadProgress() {
        const stored = localStorage.getItem(LEVEL_CONFIG.storageKey);
        if (stored) {
            userStats = JSON.parse(stored);
        } else {
            this.saveProgress();
        }
    }

    // Guardar progreso a localStorage
    saveProgress() {
        localStorage.setItem(LEVEL_CONFIG.storageKey, JSON.stringify(userStats));
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
            // Desde raíz: index.html, desde /pages/: ../index.html
            return isInPages ? '../index.html' : 'index.html';
        } else if (page === 'about') {
            // Desde raíz: pages/about.html, desde /pages/: about.html
            return isInPages ? 'about.html' : 'pages/about.html';
        }
        return page;
    }

    // Calcular XP necesario para siguiente nivel
    getXPForLevel(level) {
        return level * LEVEL_CONFIG.baseXP;
    }

    // Añadir XP y manejar subida de nivel
    addXP(amount) {
        const previousLevel = userStats.level;
        userStats.xp += amount;

        // Verificar subidas de nivel
        while (userStats.xp >= this.getXPForLevel(userStats.level)) {
            userStats.xp -= this.getXPForLevel(userStats.level);
            userStats.level++;
            this.showLevelUpNotification(userStats.level);
        }

        if (userStats.level > previousLevel || amount > 0) {
            this.updateLevelUI();
        }

        this.saveProgress();
    }

    // Mostrar notificación de XP ganado
    showXPNotification(amount) {
        const notification = document.createElement('div');
        notification.className = 'xp-notification';
        notification.innerHTML = `
            <span class="notification-icon">⚡</span>
            <div>
                <span class="notification-text">XP Gained!</span>
                <span class="notification-xp">+${amount} XP</span>
            </div>
        `;
        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 3000);
    }

    // Mostrar notificación de subida de nivel
    showLevelUpNotification(newLevel) {
        const notification = document.createElement('div');
        notification.className = 'xp-notification level-up';
        notification.innerHTML = `
            <span class="notification-icon level-up-icon">⭐</span>
            <div>
                <span class="notification-text">Level Up!</span>
                <span class="notification-xp">Now Level ${newLevel}</span>
            </div>
        `;
        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 4000);
    }

    // Actualizar UI del nivel
    updateLevelUI() {
        const xpFill = document.querySelector('.xp-fill');
        const xpValue = document.querySelector('.xp-value');
        const levelBadge = document.querySelector('.level-badge');

        if (xpFill) {
            const xpNeeded = this.getXPForLevel(userStats.level);
            const percentage = (userStats.xp / xpNeeded) * 100;
            xpFill.style.width = percentage + '%';
        }

        if (xpValue) {
            const xpNeeded = this.getXPForLevel(userStats.level);
            xpValue.textContent = `${userStats.xp}/${xpNeeded}`;
        }

        if (levelBadge) {
            levelBadge.textContent = userStats.level;
        }
    }

    // Verificar experiencia de página actual
    checkPageExperience() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        if (!userStats.visitedPages.includes(currentPage)) {
            userStats.visitedPages.push(currentPage);
            this.addXP(LEVEL_CONFIG.xpPerPage);
            this.showXPNotification(LEVEL_CONFIG.xpPerPage);
            this.saveProgress();
        }
    }

    createNavbar() {
        const homeLink = this.getPath('home');
        const aboutLink = this.getPath('about');
        
        // Determinar el link de Projects
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const isInPages = window.location.pathname.includes('/pages/');
        let projectsLink;
        
        if (currentPage === 'index.html') {
            // Si estamos en index.html, hacer scroll a #projects en la misma página
            projectsLink = '#projects';
        } else {
            // Si no estamos en index.html, ir a index.html#projects
            projectsLink = isInPages ? '../index.html#projects' : 'index.html#projects';
        }

        const xpNeeded = this.getXPForLevel(userStats.level);

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
                        <li class="level-container">
                            <div class="level-badge">${userStats.level}</div>
                            <div class="xp-container">
                                <div class="xp-label">
                                    <span>XP</span>
                                    <span class="xp-value">${userStats.xp}/${xpNeeded}</span>
                                </div>
                                <div class="xp-bar">
                                    <div class="xp-fill" style="width: ${(userStats.xp / xpNeeded) * 100}%"></div>
                                </div>
                            </div>
                        </li>
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

    // Configurar bonificación de XP para descargar resume
    setupResumeButton() {
        // En index.html: .btn-resume
        const resumeButton1 = document.querySelector('.btn-resume');
        if (resumeButton1) {
            resumeButton1.addEventListener('click', (e) => {
                this.addXP(100);
                this.showXPNotification(100);
                console.log('🎖️  Resume descargado! +100 XP');
            });
        }

        // En about.html: .btn.btn-primary (dentro del contexto de resume)
        const resumeLinks = document.querySelectorAll('a[href*="drive.google.com"]');
        resumeLinks.forEach(link => {
            if (link.textContent.includes('Resume') || link.textContent.includes('Download')) {
                link.addEventListener('click', (e) => {
                    this.addXP(100);
                    this.showXPNotification(100);
                    console.log('🎖️  Resume descargado! +100 XP');
                });
            }
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new Navbar();
});
