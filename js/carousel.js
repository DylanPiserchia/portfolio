/* ===========================
   CAROUSEL
   Una sola implementacion, y funciona con varios carousels
   en la misma pagina (antes cada uno movia siempre al primero).

   Markup esperado:
     <div class="carousel-container">
        <button class="carousel-btn prev" onclick="slideCarousel(-1)">...</button>
        <div class="carousel-viewport">        <- opcional
            <div class="carousel-track">
                <div class="gallery-item">...</div>
            </div>
        </div>
        <button class="carousel-btn next" onclick="slideCarousel(1)">...</button>
     </div>

   Las flechas se ocultan solas cuando no hay a donde avanzar.
   =========================== */

(function () {
    'use strict';

    const GAP = 24; // 1.5rem, el gap de .carousel-track

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
        const source = (event && event.target) || (window.event && window.event.target);
        const container = source
            ? source.closest('.carousel-container')
            : document.querySelector('.carousel-container');
        if (!container) return;
        apply(container, parseInt(container.dataset.currentSlide || '0', 10) + direction);
    };

    function initAll() {
        document.querySelectorAll('.carousel-container').forEach(c => apply(c, parseInt(c.dataset.currentSlide || '0', 10)));
    }

    document.addEventListener('DOMContentLoaded', initAll);
    window.addEventListener('load', initAll);

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(initAll, 150);
    });
})();
