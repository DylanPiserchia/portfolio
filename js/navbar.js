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
    // El nivel aparece en tres lugares (navbar de desktop, pastilla de mobile
    // y menu desplegable), asi que se actualizan todos.
    updateLevelUI() {
        const xpNeeded = this.getXPForLevel(userStats.level);
        const percentage = (userStats.xp / xpNeeded) * 100;

        document.querySelectorAll('.xp-fill').forEach(el => {
            el.style.width = percentage + '%';
        });

        document.querySelectorAll('.xp-value').forEach(el => {
            el.textContent = `${userStats.xp}/${xpNeeded}`;
        });

        document.querySelectorAll('.level-badge, .sheet-level-n').forEach(el => {
            el.textContent = userStats.level;
        });
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

        const pct = (userStats.xp / xpNeeded) * 100;

        const navHTML = `
            <nav>
                <div class="nav-container">
                    <a href="${homeLink}" class="nav-brand">Dylan Piserchia</a>
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
                                    <div class="xp-fill" style="width: ${pct}%"></div>
                                </div>
                            </div>
                        </li>
                    </ul>

                    <!-- Solo mobile: la pastilla de nivel y el boton del menu -->
                    <div class="nav-mobile">
                        <div class="level-chip">
                            <span class="level-badge">${userStats.level}</span>
                            <span class="xp-value">${userStats.xp}/${xpNeeded}</span>
                        </div>
                        <button class="nav-toggle" id="navToggle" aria-label="Abrir menú"
                                aria-expanded="false" aria-controls="navSheet">
                            <i class="fas fa-bars"></i>
                        </button>
                    </div>
                </div>
                <!-- Solo mobile: el progreso de XP como linea al pie de la barra -->
                <div class="nav-xpline"><span class="xp-fill" style="width: ${pct}%"></span></div>
            </nav>
        `;

        const placeholder = document.getElementById('navbar-placeholder');
        if (placeholder) {
            placeholder.innerHTML = navHTML;
            this.nav = document.querySelector('nav');
        }

        this.createSheet(homeLink, projectsLink, aboutLink, xpNeeded, pct);
    }

    // Menu de pantalla completa (solo se ve en mobile)
    createSheet(homeLink, projectsLink, aboutLink, xpNeeded, pct) {
        if (document.getElementById('navSheet')) return;

        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const isInPages = window.location.pathname.includes('/pages/');
        const prefix = isInPages ? '' : 'pages/';
        const assets = isInPages ? '../assets/img/' : 'assets/img/';

        const proyectos = (window.PORTFOLIO_PROJECTS || []).map(p => `
            <a href="${prefix}${p.archivo}" class="sheet-project${p.archivo === currentPage ? ' current' : ''}">
                <span class="sheet-thumb" style="background-image: url('${assets}${p.imagen}')"></span>
                <span class="sheet-project-text">
                    <strong>${p.titulo}</strong>
                    <small>${p.categoria}</small>
                </span>
            </a>
        `).join('');

        const isHome = currentPage === 'index.html';
        const sheetHTML = `
            <div class="nav-sheet" id="navSheet" role="dialog" aria-modal="true" aria-label="Menú" hidden>
                <div class="sheet-top">
                    <span class="nav-brand">Dylan Piserchia</span>
                    <button class="sheet-close" id="sheetClose" aria-label="Cerrar menú">&times;</button>
                </div>

                <div class="sheet-links">
                    <a href="${homeLink}"${isHome ? ' class="current"' : ''}>Home <i class="fas fa-arrow-right"></i></a>
                    <a href="${projectsLink}">Projects <i class="fas fa-arrow-right"></i></a>
                    <a href="${aboutLink}"${currentPage === 'about.html' ? ' class="current"' : ''}>About <i class="fas fa-arrow-right"></i></a>
                </div>

                ${proyectos ? `<div class="sheet-section">
                    <div class="sheet-label">Proyectos</div>
                    ${proyectos}
                </div>` : ''}

                <div class="sheet-level">
                    <span class="level-badge">${userStats.level}</span>
                    <div class="sheet-level-meta">
                        <div class="sheet-level-top">
                            <span>Nivel <span class="sheet-level-n">${userStats.level}</span></span>
                            <span><span class="xp-value">${userStats.xp}/${xpNeeded}</span> XP</span>
                        </div>
                        <div class="xp-bar"><div class="xp-fill" style="width: ${pct}%"></div></div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', sheetHTML);
    }

    openSheet() {
        const sheet = document.getElementById('navSheet');
        const toggle = document.getElementById('navToggle');
        if (!sheet) return;
        sheet.hidden = false;
        // el reflow hace que la transicion de entrada se vea
        void sheet.offsetWidth;
        sheet.classList.add('open');
        if (toggle) toggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        const close = document.getElementById('sheetClose');
        if (close) close.focus();
    }

    closeSheet() {
        const sheet = document.getElementById('navSheet');
        const toggle = document.getElementById('navToggle');
        if (!sheet || sheet.hidden) return;
        sheet.classList.remove('open');
        if (toggle) {
            toggle.setAttribute('aria-expanded', 'false');
            toggle.focus();
        }
        document.body.style.overflow = '';
        const hide = () => { sheet.hidden = true; };
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) hide();
        else setTimeout(hide, 220);
    }

    attachEventListeners() {
        const toggle = document.getElementById('navToggle');
        const sheet = document.getElementById('navSheet');
        const close = document.getElementById('sheetClose');

        if (toggle) toggle.addEventListener('click', () => this.openSheet());
        if (close) close.addEventListener('click', () => this.closeSheet());

        // Tocar el fondo del menu tambien lo cierra
        if (sheet) {
            sheet.addEventListener('click', (e) => {
                if (e.target === sheet) this.closeSheet();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeSheet();
        });

        // Si la pantalla se agranda con el menu abierto, cerrarlo
        matchMedia('(min-width: 769px)').addEventListener('change', (e) => {
            if (e.matches) this.closeSheet();
        });

        // Links con hash (#projects): scroll suave si ya estamos en esa pagina
        const all = document.querySelectorAll('.nav-links a, .sheet-links a, .sheet-project');
        all.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');

                if (href && href.includes('#')) {
                    const [page, hash] = href.split('#');
                    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
                    const targetPage = page.split('/').pop() || currentPage;

                    if (targetPage === currentPage) {
                        e.preventDefault();
                        this.closeSheet();
                        const target = document.getElementById(hash);
                        if (target) target.scrollIntoView({ behavior: 'smooth' });
                        return;
                    }
                }

                this.closeSheet();
            });
        });
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
