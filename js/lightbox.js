/* ===========================
   LIGHTBOX
   Una sola implementacion para todas las paginas.
   Antes estaba repetida dentro de cada HTML.

   Uso desde el markup:
     <div class="gallery-item" onclick="openLightbox(this.querySelector('img'))">
        <img src="..." alt="...">                      <- imagen normal
        <img src="..." data-video="https://...embed">  <- abre el video
     </div>

   Las flechas recorren el grupo al que pertenece la imagen
   (.section-gallery, .carousel-track o .hero-media-wrapper).
   =========================== */

(function () {
    'use strict';

    const GROUP_SELECTORS = ['.section-gallery', '.carousel-track', '.hero-media-wrapper'];

    let images = [];
    let index = 0;

    const el = (id) => document.getElementById(id);
    const box = () => el('lightbox');

    function groupOf(img) {
        for (const sel of GROUP_SELECTORS) {
            const found = img.closest(sel);
            if (found) return found;
        }
        return null;
    }

    function render() {
        const current = images[index];
        if (!current) return;

        const img = el('lightbox-img');
        const video = el('lightbox-video');
        const videoSrc = current.getAttribute('data-video');

        if (videoSrc && video) {
            img.style.display = 'none';
            video.style.display = 'block';
            video.src = videoSrc + (videoSrc.includes('?') ? '&' : '?') + 'autoplay=1&rel=0';
        } else {
            if (video) {
                video.style.display = 'none';
                video.src = '';
            }
            img.style.display = 'block';
            img.src = current.currentSrc || current.src;
            img.alt = current.alt || '';
        }

        // Las flechas solo tienen sentido si hay mas de una imagen en el grupo
        document.querySelectorAll('#lightbox .nav-btn').forEach(btn => {
            btn.style.display = images.length > 1 ? '' : 'none';
        });
    }

    window.openLightbox = function (imgElement) {
        if (!imgElement || !box()) return;
        const group = groupOf(imgElement);
        images = group ? Array.from(group.querySelectorAll('img')) : [imgElement];
        index = Math.max(0, images.indexOf(imgElement));
        render();
        box().classList.add('show');
        document.body.style.overflow = 'hidden';
    };

    window.changeImage = function (direction, event) {
        if (event) event.stopPropagation();
        if (!images.length) return;
        index = (index + direction + images.length) % images.length;
        render();
    };

    window.closeLightbox = function (event) {
        const lightbox = box();
        if (!lightbox) return;

        if (event && event.target) {
            const t = event.target;
            const isBackdrop = t.id === 'lightbox' ||
                t.classList.contains('close-btn') ||
                t.classList.contains('lightbox-content-wrapper');
            if (!isBackdrop) return;
        }

        lightbox.classList.remove('show');
        const video = el('lightbox-video');
        if (video) video.src = '';
        document.body.style.overflow = '';
    };

    document.addEventListener('keydown', (e) => {
        const lightbox = box();
        if (!lightbox || !lightbox.classList.contains('show')) return;
        if (e.key === 'Escape') window.closeLightbox();
        if (e.key === 'ArrowLeft') window.changeImage(-1);
        if (e.key === 'ArrowRight') window.changeImage(1);
    });

    // En el telefono se pasa de imagen deslizando, que es lo que uno espera.
    document.addEventListener('DOMContentLoaded', () => {
        const lightbox = box();
        if (!lightbox) return;

        let startX = 0, startY = 0, tracking = false;

        lightbox.addEventListener('touchstart', (e) => {
            if (e.touches.length !== 1) { tracking = false; return; }
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            tracking = true;
        }, { passive: true });

        lightbox.addEventListener('touchend', (e) => {
            if (!tracking || !e.changedTouches.length) return;
            tracking = false;

            const dx = e.changedTouches[0].clientX - startX;
            const dy = e.changedTouches[0].clientY - startY;

            // Solo si el gesto fue claramente horizontal y largo
            if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) {
                window.changeImage(dx < 0 ? 1 : -1);
            }
        }, { passive: true });
    });
})();
