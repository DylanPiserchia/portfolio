/* ===========================
   GOOGLE ANALYTICS (GA4)
   Antes el tag estaba solo en index.html, asi que las visitas a las
   paginas de proyecto no se median. Ahora lo carga cada pagina desde aca
   y el ID vive en un unico lugar.

   No mide cuando el sitio corre en local: probar el sitio en tu maquina
   (o desde el celular apuntando a tu IP de la red) ensuciaba los datos
   con visitas que no son de nadie.
   =========================== */

(function () {
    'use strict';

    const MEASUREMENT_ID = 'G-BQHTRMV18K';

    const host = location.hostname;

    const esEntornoLocal =
        host === '' ||                            // el html abierto con doble clic (file://)
        host === 'localhost' ||
        host === '127.0.0.1' ||
        host === '[::1]' ||
        host.endsWith('.local') ||
        /^192\.168\./.test(host) ||               // tu compu vista desde el celular
        /^10\./.test(host) ||
        /^172\.(1[6-9]|2\d|3[01])\./.test(host);

    if (esEntornoLocal) {
        console.info('[analytics] entorno local (' + (host || 'file://') + '): no se envia nada a Google Analytics');
        return;
    }

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
