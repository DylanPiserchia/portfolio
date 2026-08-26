/* ===========================
   GOOGLE ANALYTICS (GA4)
   Antes el tag estaba solo en index.html, asi que las visitas a las
   paginas de proyecto no se median. Ahora lo carga cada pagina desde aca
   y el ID vive en un unico lugar.
   =========================== */

(function () {
    'use strict';

    const MEASUREMENT_ID = 'G-BQHTRMV18K';

    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
    document.head.appendChild(tag);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', MEASUREMENT_ID);
})();
