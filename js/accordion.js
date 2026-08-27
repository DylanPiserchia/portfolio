/* ===========================
   ACORDEON DE SECCIONES (solo mobile)

   En Unreal Engine Systems hay 7 sistemas uno abajo del otro: en el
   telefono eran mas de 10 pantallas de scroll. Aca cada sistema arranca
   cerrado y se abre al tocarlo, con el indice de arriba como entrada.

   Se activa solo en las paginas que tienen un indice (.systems-index) y
   solo por debajo de 768px. Al agrandar la ventana se deshace y el
   desktop queda exactamente como estaba.
   =========================== */

(function () {
    'use strict';

    const MOBILE = '(max-width: 768px)';
    const isMobile = () => window.matchMedia(MOBILE).matches;

    function targetSections() {
        if (!document.querySelector('.systems-index')) return [];
        const ids = [...document.querySelectorAll('.index-card[href^="#"]')]
            .map(a => a.getAttribute('href').slice(1));
        return ids
            .map(id => document.getElementById(id))
            .filter(el => el && el.classList.contains('detail-section'));
    }

    function build(section) {
        if (section.dataset.collapsible === '1') return;

        const header = section.querySelector('.section-header');
        if (!header) return;

        // Todo lo que viene despues del encabezado se envuelve para poder ocultarlo
        const body = document.createElement('div');
        body.className = 'collapse-body';
        let node = header.nextSibling;
        while (node) {
            const next = node.nextSibling;
            body.appendChild(node);
            node = next;
        }
        section.appendChild(body);

        const icon = document.createElement('span');
        icon.className = 'collapse-icon';
        icon.setAttribute('aria-hidden', 'true');
        icon.innerHTML = '<i class="fas fa-chevron-right"></i>';
        header.appendChild(icon);

        header.setAttribute('role', 'button');
        header.setAttribute('tabindex', '0');
        header.setAttribute('aria-expanded', 'false');

        header.addEventListener('click', () => toggle(section));
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle(section);
            }
        });

        section.classList.add('collapsible');
        section.dataset.collapsible = '1';
    }

    function unbuild(section) {
        if (section.dataset.collapsible !== '1') return;

        const body = section.querySelector(':scope > .collapse-body');
        if (body) {
            while (body.firstChild) section.insertBefore(body.firstChild, body);
            body.remove();
        }

        const header = section.querySelector('.section-header');
        if (header) {
            const icon = header.querySelector('.collapse-icon');
            if (icon) icon.remove();
            header.removeAttribute('role');
            header.removeAttribute('tabindex');
            header.removeAttribute('aria-expanded');
        }

        section.classList.remove('collapsible', 'open');
        // los listeners quedan, pero toggle() no hace nada fuera de mobile
        delete section.dataset.collapsible;
    }

    function toggle(section, force) {
        if (!isMobile()) return;
        const open = force !== undefined ? force : !section.classList.contains('open');
        section.classList.toggle('open', open);
        const header = section.querySelector('.section-header');
        if (header) header.setAttribute('aria-expanded', String(open));

        // Adentro puede haber carousels que hasta ahora median cero
        if (open && typeof window.refreshCarousels === 'function') {
            requestAnimationFrame(window.refreshCarousels);
        }
    }

    function openFromHash() {
        const id = location.hash.slice(1);
        if (!id) return;
        const section = document.getElementById(id);
        if (section && section.classList.contains('collapsible')) {
            toggle(section, true);
            section.scrollIntoView({ block: 'start' });
        }
    }

    function bindIndex() {
        document.querySelectorAll('.index-card[href^="#"]').forEach(card => {
            if (card.dataset.accordionBound) return;
            card.dataset.accordionBound = '1';

            card.addEventListener('click', (e) => {
                if (!isMobile()) return;
                const section = document.getElementById(card.getAttribute('href').slice(1));
                if (!section || !section.classList.contains('collapsible')) return;
                e.preventDefault();
                toggle(section, true);
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    }

    function sync() {
        const sections = targetSections();
        if (!sections.length) return;
        sections.forEach(isMobile() ? build : unbuild);
        bindIndex();
    }

    document.addEventListener('DOMContentLoaded', () => {
        sync();
        openFromHash();
        window.addEventListener('hashchange', openFromHash);
    });

    window.matchMedia(MOBILE).addEventListener('change', sync);
})();
