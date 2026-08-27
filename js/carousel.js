/* ===========================
   CAROUSEL
   Una sola implementacion, y funciona con varios carousels
   en la misma pagina (antes cada uno movia siempre al primero).

   Markup esperado:
     <div class="carousel-container">
        <button class="carousel-btn prev" onclick="slideCarousel(-1, event)">...</button>
        <div class="carousel-viewport">        <- opcional
            <div class="carousel-track">
                <div class="gallery-item">...</div>
            </div>
        </div>
        <button class="carousel-btn next" onclick="slideCarousel(1, event)">...</button>
     </div>

   En desktop las flechas mueven la fila y se ocultan cuando no hay a
   donde avanzar. En mobile no hay flechas: la fila se desliza con el
   dedo (scroll nativo con encastre, lo hace mobile.css) y este archivo
   solo dibuja los puntitos de posicion.
   =========================== */

(function () {
    'use strict';

    const GAP = 24; // 1.5rem, el gap de .carousel-track en desktop

    const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

    /* ---------- desktop ---------- */

    function metrics(container) {
        const track = container.querySelector('.carousel-track');
        if (!track) return null;
        const items = track.querySelectorAll('.gallery-item');
        if (!items.length) return null;

        const viewport = container.querySelector('.carousel-viewport') || container;
        const itemWidth = items[0].getBoundingClientRect().width + GAP;
        const visible = viewport.getBoundingClientRect().width;
        const itemsInView = Math.max(1, Math.round(visible / itemWidth));
        const maxSlide = Math.max(0, items.length - itemsInView);

        return { track, items, itemWidth, maxSlide };
    }

    function apply(container, slide) {
        const m = metrics(container);
        if (!m) return;

        const value = Math.min(Math.max(slide, 0), m.maxSlide);
        container.dataset.currentSlide = value;
        m.track.style.transform = 'translateX(-' + (value * m.itemWidth) + 'px)';

        const prev = container.querySelector('.carousel-btn.prev');
        const next = container.querySelector('.carousel-btn.next');
        // Sin nada que recorrer no hay flechas; si hay, solo se ve la util.
        if (prev) prev.style.display = (m.maxSlide === 0 || value === 0) ? 'none' : '';
        if (next) next.style.display = (m.maxSlide === 0 || value >= m.maxSlide) ? 'none' : '';
    }

    /* Llamado desde los onclick del markup */
    window.slideCarousel = function (direction, event) {
        if (isMobile()) return;
        const source = (event && event.target) || (window.event && window.event.target);
        const container = source
            ? source.closest('.carousel-container')
            : document.querySelector('.carousel-container');
        if (!container) return;
        apply(container, parseInt(container.dataset.currentSlide || '0', 10) + direction);
    };

    /* ---------- mobile: puntitos ---------- */

    function swipeRows() {
        return document.querySelectorAll('.carousel-track, .section-gallery');
    }

    function paintDots(row, dots) {
        const items = row.children;
        if (!items.length) return;
        const step = row.scrollWidth / items.length;
        const index = Math.min(items.length - 1, Math.round(row.scrollLeft / step));
        [...dots.children].forEach((d, i) => d.classList.toggle('on', i === index));
    }

    function buildDots(row) {
        const items = row.querySelectorAll(':scope > .gallery-item');
        const anchor = row.closest('.carousel-container') || row;
        let dots = anchor.nextElementSibling;

        if (items.length < 2) {
            if (dots && dots.classList.contains('swipe-dots')) dots.remove();
            return;
        }

        if (!dots || !dots.classList.contains('swipe-dots')) {
            dots = document.createElement('div');
            dots.className = 'swipe-dots';
            dots.setAttribute('aria-hidden', 'true');
            anchor.insertAdjacentElement('afterend', dots);
        }

        if (dots.children.length !== items.length) {
            dots.innerHTML = '';
            items.forEach(() => dots.appendChild(document.createElement('span')));
        }

        paintDots(row, dots);

        if (!row.dataset.dotsBound) {
            row.dataset.dotsBound = '1';
            let ticking = false;
            row.addEventListener('scroll', () => {
                if (ticking) return;
                ticking = true;
                requestAnimationFrame(() => {
                    const d = (row.closest('.carousel-container') || row).nextElementSibling;
                    if (d && d.classList.contains('swipe-dots')) paintDots(row, d);
                    ticking = false;
                });
            }, { passive: true });
        }
    }

    function clearDots() {
        document.querySelectorAll('.swipe-dots').forEach(d => d.remove());
    }

    /* ---------- arranque ---------- */

    function initAll() {
        if (isMobile()) {
            // El scroll nativo se encarga; hay que soltar cualquier transform
            // que haya quedado del modo desktop.
            document.querySelectorAll('.carousel-track').forEach(t => {
                t.style.transform = '';
            });
            document.querySelectorAll('.carousel-container').forEach(c => {
                c.dataset.currentSlide = '0';
            });
            swipeRows().forEach(buildDots);
        } else {
            clearDots();
            document.querySelectorAll('.carousel-container').forEach(c => {
                apply(c, parseInt(c.dataset.currentSlide || '0', 10));
            });
        }
    }

    // Las secciones del acordeon arrancan ocultas: cuando se abre una hay que
    // recalcular, porque adentro los anchos recien ahi existen.
    window.refreshCarousels = initAll;

    document.addEventListener('DOMContentLoaded', initAll);
    window.addEventListener('load', initAll);

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(initAll, 150);
    });
})();
