/* ===========================
   LIGHTBOX COMPONENT
   =========================== */

class Lightbox {
    constructor() {
        this.lightbox = null;
        this.currentImages = [];
        this.currentIndex = 0;
        this.init();
    }

    init() {
        this.createLightbox();
        this.attachEventListeners();
    }

    createLightbox() {
        const lightboxHTML = `
            <div id="lightbox" class="lightbox" onclick="lightboxInstance.closeLightbox(event)">
                <div class="close-btn" onclick="lightboxInstance.closeLightbox(event)">&times;</div>
                
                <button class="nav-btn prev" onclick="lightboxInstance.changeImage(-1, event)">
                    <i class="fas fa-chevron-left"></i>
                </button>

                <div class="lightbox-content-wrapper">
                    <img class="lightbox-content" id="lightbox-img" alt="Lightbox View" style="display: block;">
                    <iframe id="lightbox-video" class="lightbox-video" style="display: none;" 
                            frameborder="0" allowfullscreen></iframe>
                </div>

                <button class="nav-btn next" onclick="lightboxInstance.changeImage(1, event)">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `;

        const body = document.body;
        body.insertAdjacentHTML('beforeend', lightboxHTML);
        this.lightbox = document.getElementById('lightbox');
    }

    attachEventListeners() {
        // Agregar event listeners a todas las imágenes de galería
        document.addEventListener('click', (e) => {
            if (e.target.closest('.gallery-item img') || e.target.closest('.gallery-item')) {
                const galleryItems = document.querySelectorAll('.gallery-item');
                this.currentImages = Array.from(galleryItems).map(item => ({
                    img: item.querySelector('img'),
                    video: item.querySelector('img')?.getAttribute('data-video')
                }));
                
                const clickedImg = e.target.closest('.gallery-item img') || e.target.closest('.gallery-item').querySelector('img');
                this.currentIndex = Array.from(galleryItems).indexOf(e.target.closest('.gallery-item'));
                this.openLightbox();
            }
        });

        // Controles de teclado
        document.addEventListener('keydown', (e) => {
            if (!this.lightbox.classList.contains('show')) return;
            
            if (e.key === 'ArrowLeft') this.changeImage(-1);
            if (e.key === 'ArrowRight') this.changeImage(1);
            if (e.key === 'Escape') this.closeLightbox();
        });
    }

    openLightbox() {
        const item = this.currentImages[this.currentIndex];
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxVideo = document.getElementById('lightbox-video');

        const videoSrc = item.video?.getAttribute('data-video');

        if (videoSrc) {
            lightboxImg.style.display = 'none';
            lightboxVideo.style.display = 'block';
            lightboxVideo.src = videoSrc + "?autoplay=1&rel=0";
        } else {
            lightboxVideo.style.display = 'none';
            lightboxVideo.src = "";
            lightboxImg.style.display = 'block';
            lightboxImg.src = item.img.src;
        }

        this.lightbox.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    changeImage(direction, event) {
        if (event) event.stopPropagation();
        
        this.currentIndex = (this.currentIndex + direction + this.currentImages.length) % this.currentImages.length;
        this.updateLightboxContent();
    }

    updateLightboxContent() {
        const item = this.currentImages[this.currentIndex];
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxVideo = document.getElementById('lightbox-video');

        const videoSrc = item.video?.getAttribute('data-video');

        if (videoSrc) {
            lightboxImg.style.display = 'none';
            lightboxVideo.style.display = 'block';
            lightboxVideo.src = videoSrc + "?autoplay=1&rel=0";
        } else {
            lightboxVideo.style.display = 'none';
            lightboxVideo.src = "";
            lightboxImg.style.display = 'block';
            lightboxImg.src = item.img.src;
        }
    }

    closeLightbox(event) {
        if (event && event.target.id !== 'lightbox' && !event.target.classList.contains('close-btn')) {
            return;
        }

        document.getElementById('lightbox-video').src = "";
        this.lightbox.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// Global instance para acceso desde HTML inline
let lightboxInstance;

document.addEventListener('DOMContentLoaded', () => {
    lightboxInstance = new Lightbox();
});
