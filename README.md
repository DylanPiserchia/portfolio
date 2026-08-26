# Portfolio — Dylan Piserchia

**En vivo:** <https://zenithardev.github.io/portfolio/>

Sitio estático, sin build ni dependencias: son archivos HTML, CSS y JS que
GitHub Pages sirve tal cual. Lo que subís a `main` es exactamente lo que se
publica.

> Esa dirección aparece en el `canonical`, el `og:url` y el `og:image` de cada
> página. Si algún día cambiás de dominio o de nombre de usuario, hay que
> reemplazarla en las 5 páginas **y** regenerar las imágenes de `assets/og/`,
> que la llevan impresa abajo a la izquierda.

---

## Ver el sitio en tu máquina

Abrir los HTML con doble clic **no funciona bien**: los navegadores bloquean
parte del JavaScript en archivos locales. Levantá un servidor:

```bash
python -m http.server 8000
```

Y entrá a <http://localhost:8000>. Ctrl+C para cortarlo.

---

## Estructura

```
index.html                    Home: hero + tarjetas de proyecto
pages/
  about.html                  Sobre mí
  star-trek-infinite.html     Proyecto
  project-shelter.html        Proyecto (Unreal Engine Systems)
  PROJECT_TEMPLATE.html       Plantilla para páginas nuevas
css/
  variables.css               Colores, medidas y transiciones. Se carga en todas.
  components.css              Botones, tarjetas, tags, accesibilidad
  navbar.css / footer.css     Navegación y pie
  level-system.css            Badge de nivel y barra de XP
  page.css                    Base de las páginas internas (tema + contenedor 1600px)
  project.css                 Hero, secciones, galerías, carousel y lightbox
  home.css / about.css        Lo específico de esas dos páginas
  star-trek.css               Un único ajuste de esa página (padding del footer)
js/
  analytics.js                Google Analytics (el ID vive acá y en ningún otro lado)
  navbar.js                   Navbar + sistema de XP
  footer.js                   Footer + botón de reset del nivel
  scroll-animations.js        Aparición de secciones al scrollear
  lightbox.js                 Visor de imágenes y videos
  carousel.js                 Carousels (varios por página)
assets/
  img/                        Las imágenes que usa el sitio, en .webp
  img/_originals/             Los archivos originales, sin comprimir. No se sirven.
  og/                         Imágenes de preview para LinkedIn/X/WhatsApp
  favicon.svg, favicon.png
tools/
  optimize-images.py          Convierte imágenes nuevas a WebP
  gamification-test.js        Diagnóstico del sistema de XP (pegar en la consola)
```

### En qué orden se cargan los CSS

Importa, porque el último gana:

| Página | Hojas de estilo |
|---|---|
| `index.html` | variables, components, navbar, footer, level-system, **home** |
| `about.html` | variables, components, navbar, footer, level-system, **page**, **about** |
| páginas de proyecto | variables, components, navbar, footer, level-system, **page**, **project** |

`project-shelter.html` además lleva `class="project-compact"` en el `<body>`:
usa las mismas reglas con medidas algo más ajustadas.

---

## Agregar un proyecto nuevo

> Esto es lo que hay hoy. Está pendiente reemplazarlo por un sistema donde
> cada proyecto sea un archivo de texto y la página se genere sola.

**1. Copiar la plantilla**

```bash
cp pages/PROJECT_TEMPLATE.html pages/mi-proyecto.html
```

**2. Editar el `<head>`**

Cambiar `title`, `description`, `canonical`, `og:title`, `og:description` y
`og:url` por los del proyecto nuevo, y borrar la línea
`<meta name="robots" content="noindex">` (está solo para que la plantilla no
aparezca en Google).

**3. Escribir el contenido**

La plantilla ya trae la estructura: hero, secciones de detalle con dos
columnas, galería y carousel. Reemplazá los textos entre corchetes.

**4. Preparar las imágenes**

Copiá los PNG o JPG a `assets/img/` y corré:

```bash
python tools/optimize-images.py
```

Deja los `.webp` listos y guarda los originales en `_originals/`. En el HTML
referenciá siempre el `.webp`, con `loading="lazy"`, `decoding="async"` y los
atributos `width` y `height` (el script te imprime las medidas).

**5. Imagen de preview**

Para que el link muestre imagen al compartirlo hace falta un archivo de
1200x630 en `assets/og/`, apuntado desde el `og:image` de la página.

**6. Agregar la tarjeta en la home**

En `index.html`, dentro de `<div class="grid">`, duplicá un bloque `<a class="card">`
y cambiá el link, la imagen, la categoría, el título, la descripción y los tags.

---

## Componentes que podés usar

**Animación de entrada** — la sección aparece al scrollear:

```html
<section class="detail-section reveal-up">   <!-- o reveal-left / reveal-right -->
```

**Galería** (pocas imágenes, en grilla):

```html
<div class="section-gallery">
    <div class="gallery-item" onclick="openLightbox(this.querySelector('img'))">
        <img src="../assets/img/foto.webp" alt="Descripción real de la imagen"
             loading="lazy" decoding="async" width="1600" height="900">
        <div class="gallery-overlay"><span class="gallery-caption">Epígrafe</span></div>
    </div>
</div>
```

**Carousel** (muchas imágenes). Las flechas se ocultan solas si no hay a dónde
avanzar, y podés poner varios en la misma página:

```html
<div class="carousel-container">
    <button type="button" class="carousel-btn prev" aria-label="Imagen anterior"
            onclick="slideCarousel(-1, event)"><i class="fas fa-chevron-left"></i></button>
    <div class="carousel-viewport">
        <div class="carousel-track">
            <!-- gallery-item, uno por imagen -->
        </div>
    </div>
    <button type="button" class="carousel-btn next" aria-label="Imagen siguiente"
            onclick="slideCarousel(1, event)"><i class="fas fa-chevron-right"></i></button>
</div>
```

**Video de YouTube** — el lightbox lo reconoce por el `data-video`. La imagen
es la miniatura sobre la que se hace clic:

```html
<div class="gallery-item" onclick="openLightbox(this.querySelector('img'))">
    <img src="../assets/img/miniatura.webp" alt="..."
         data-video="https://www.youtube.com/embed/ID_DEL_VIDEO">
    <div class="play-icon"><i class="fas fa-play-circle"></i></div>
</div>
```

**Otros**: `.btn` / `.btn-primary`, `.tag`, `.styled-list`, `.impact-box`,
`.mini-highlights` con `.highlight-list`.

---

## Sistema de niveles

Es un detalle de la navbar, manejado por `js/navbar.js`.

- Cada página distinta que visita alguien suma **25 XP**.
- Descargar el CV suma **100 XP**.
- Para pasar de nivel N hacen falta `N × 100` XP.
- Todo vive en el `localStorage` del visitante, bajo la clave `portfolio_data`.
  No se guarda nada en ningún servidor.
- El botón *Reset Level* del footer borra ese dato.

Para revisarlo, pegá el contenido de `tools/gamification-test.js` en la consola
del navegador.

---

## Analytics

El tag de GA4 lo inyecta `js/analytics.js`, que cargan las cinco páginas. Si
alguna vez cambia el ID de medición, se cambia **solo ahí**.

---

## Antes de subir

- [ ] Lo miraste con `python -m http.server`, en desktop y achicando la ventana
- [ ] Las imágenes nuevas pasaron por `tools/optimize-images.py`
- [ ] Cada `<img>` tiene un `alt` que describe lo que se ve
- [ ] El `<head>` tiene el título, la descripción y el `og:image` correctos
- [ ] La consola del navegador no tira errores

---

## Deploy

`git push` a `main`. GitHub Pages publica en un minuto.

Para cambios grandes conviene trabajar en una rama y recién mergear después de
verlo funcionando.
