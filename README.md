# Portfolio — Dylan Piserchia

**En vivo:** <https://zenithardev.github.io/portfolio/>

Sitio estático: son archivos HTML, CSS y JS que GitHub Pages sirve tal cual.
Lo que subís a `main` es exactamente lo que se publica.

Las páginas de proyecto se escriben en `content/` y las arma `tools/build.py`,
un script de Python que corrés vos y deja el HTML terminado en el repo. No hay
build en la nube: si el sitio se ve bien en tu máquina, se ve bien publicado.

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
content/                      EL CONTENIDO DE CADA PROYECTO
  _PLANTILLA.toml             Copiá esto para empezar uno nuevo
  star-trek-infinite.toml
  project-shelter.toml
index.html                    Home. Las tarjetas las escribe tools/build.py
pages/
  about.html                  Sobre mí (escrita a mano)
  star-trek-infinite.html     Generada desde content/
  project-shelter.html        Generada desde content/
css/
  variables.css               Colores, medidas y transiciones. Se carga en todas.
  components.css              Botones, tarjetas, tags, accesibilidad
  navbar.css / footer.css     Navegación y pie
  level-system.css            Badge de nivel y barra de XP
  page.css                    Base de las páginas internas (tema + contenedor 1600px)
  project.css                 Hero, secciones, galerías, carousel y lightbox
  home.css / about.css        Lo específico de esas dos páginas
  star-trek.css               Un único ajuste de esa página (padding del footer)
  mobile.css                  Todo lo específico del celular. Se carga última.
js/
  analytics.js                Google Analytics (el ID vive acá y en ningún otro lado)
  projects.js                 Lista de proyectos (la genera build.py)
  navbar.js                   Navbar, menú de mobile y sistema de XP
  footer.js                   Footer + botón de reset del nivel
  scroll-animations.js        Aparición de secciones al scrollear
  lightbox.js                 Visor de imágenes y videos (con swipe en mobile)
  carousel.js                 Carousels: flechas en desktop, swipe en mobile
  accordion.js                Secciones colapsables en mobile (Unreal Engine)
assets/
  img/                        Las imágenes que usa el sitio, en .webp
  img/_originals/             Los archivos originales, sin comprimir. GitHub Pages
                              no publica carpetas que empiezan con _, así que están
                              en el repo como respaldo pero nadie se los baja.
  og/                         Imágenes de preview para LinkedIn/X/WhatsApp
  favicon.svg, favicon.png
tools/
  build.py                    Arma las páginas a partir de content/
  optimize-images.py          Convierte imágenes nuevas a WebP
  gamification-test.js        Diagnóstico del sistema de XP (pegar en la consola)
```

### En qué orden se cargan los CSS

Importa, porque el último gana:

| Página | Hojas de estilo |
|---|---|
| `index.html` | variables, components, navbar, footer, level-system, **home**, mobile |
| `about.html` | variables, components, navbar, footer, level-system, **page**, **about**, mobile |
| páginas de proyecto | variables, components, navbar, footer, level-system, **page**, **project**, mobile |

`mobile.css` va siempre al final: todo lo que hay adentro está dentro de un
`@media (max-width: 768px)`, así que en pantallas grandes no pisa nada.

`project-shelter.html` además lleva `class="project-compact"` en el `<body>`:
usa las mismas reglas con medidas algo más ajustadas.

---

## Agregar un proyecto nuevo

Son tres pasos.

**1. Las imágenes**

Copiá los PNG o JPG a `assets/img/` y corré:

```bash
python tools/optimize-images.py
```

Los pasa a WebP, guarda los originales en `_originals/` y te imprime el nombre
de cada uno.

**2. El archivo del proyecto**

Copiá `content/_PLANTILLA.toml` con el nombre que querés en la dirección:

```bash
cp content/_PLANTILLA.toml content/mi-juego-nuevo.toml
```

Ese nombre es el de la página: `content/mi-juego-nuevo.toml` se publica en
`/pages/mi-juego-nuevo.html`. Editalo: adentro está todo explicado y comentado.

**3. Construir**

```bash
python tools/build.py
```

Eso escribe la página, pone la tarjeta en la home, suma el proyecto al menú del
celular y arma la imagen de preview para LinkedIn. Después `git push` y listo.

### Las dos marcas del texto

Dentro de cualquier texto podés usar:

| Escribís | Sale |
|---|---|
| `**así**` | en negrita |
| `*así*` | en el celeste del sitio |

### Lo que no toques a mano

`pages/*.html` (salvo `about.html`), las tarjetas de `index.html` y
`js/projects.js` los escribe `build.py`. Si los editás, el próximo build pisa
los cambios. Lo que se edita es `content/`.

Podés correr `python tools/build.py` las veces que quieras: solo escribe lo que
cambió, y te avisa qué tocó.

---

## Componentes que podés usar

> Esto es el markup crudo. Para un proyecto **no hace falta**: `build.py` lo
> escribe a partir del `.toml`. Sirve para `about.html`, que está hecha a mano.

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

## Cómo funciona en el celular

Por debajo de 768px cambian tres cosas, y todas se manejan solas:

- **El menú** es una pantalla completa (`.nav-sheet`, la arma `navbar.js`) con los
  links, la lista de proyectos y el nivel abajo. El nivel además vive siempre en
  la barra, como pastilla, con el progreso de XP como una línea de 2px al pie.
- **Las galerías y los carousels** se deslizan con el dedo: scroll nativo con
  encastre por imagen. Las flechas se ocultan y `carousel.js` dibuja los puntitos.
  No hace falta hacer nada distinto en el markup.
- **Las páginas con índice de sistemas** (las que tienen `.systems-index`) se
  vuelven un acordeón: cada sección arranca cerrada. Lo hace `accordion.js`, y al
  agrandar la ventana deshace todo y el desktop queda igual que siempre.

Los epígrafes de las imágenes, que en desktop aparecen al pasar el mouse, se
muestran fijos en cualquier pantalla sin hover.

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

**No mide en local.** Si el sitio corre en `localhost`, `127.0.0.1`, una IP de
red interna (`192.168.x.x`, para probar desde el celular) o abierto como
archivo, el script corta antes de cargar nada de Google y lo avisa por consola.
Probar el sitio no ensucia los datos.

---

## Antes de subir

- [ ] Corriste `python tools/build.py` después de editar el `.toml`
- [ ] Lo miraste con `python -m http.server`, en desktop y en el celular
- [ ] Las imágenes nuevas pasaron por `tools/optimize-images.py`
- [ ] Cada `<img>` tiene un `alt` que describe lo que se ve
- [ ] El `<head>` tiene el título, la descripción y el `og:image` correctos
- [ ] La consola del navegador no tira errores

---

## Deploy

`git push` a `main`. GitHub Pages publica en un minuto.

Para cambios grandes conviene trabajar en una rama y recién mergear después de
verlo funcionando.
