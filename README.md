# 📋 Portfolio de Dylan Piserchia - Documentación

## 📁 Estructura de Carpetas

```
portfolio/
├── css/                    # Estilos modulares
│   ├── variables.css      # Variables y estilos base
│   ├── components.css     # Componentes reutilizables
│   ├── navbar.css         # Estilos de navegación
│   └── footer.css         # Estilos de pie de página
│
├── js/                     # Scripts modulares
│   ├── navbar.js          # Componente navbar
│   ├── footer.js          # Componente footer
│   ├── lightbox.js        # Componente lightbox
│   └── scroll-animations.js # Animaciones de scroll
│
├── pages/                  # Páginas adicionales
│   ├── about.html         # Página About
│   ├── star-trek-infinite.html  # Proyecto 1
│   └── project-shelter.html     # Proyecto 2
│
├── assets/
│   └── img/               # Imágenes del portfolio
│
├── index.html             # Página principal
└── README.md             # Este archivo
```

---

## 🎨 Sistema de Diseño

### Variables CSS (css/variables.css)
Todas las variables están centralizadas para fácil mantenimiento:

```css
:root {
    --bg-dark: #080a0c;
    --accent: #00d4ff;
    --text-main: #e0e0e0;
    --nav-height: 70px;
    --transition-fast: 0.3s cubic-bezier(...);
}
```

### Componentes Reutilizables (css/components.css)
- `.card` - Tarjetas de proyectos
- `.btn`, `.btn-primary`, `.btn-secondary` - Botones
- `.grid` - Grid responsive
- `.gallery-grid` - Galerías
- `.styled-list` - Listas estilizadas
- `.mini-highlights` - Cajas de highlight

---

## 🏗️ Componentes JavaScript

### Navbar (`js/navbar.js`)
Inyecta automáticamente la barra de navegación en el `#navbar-placeholder`:
```html
<div id="navbar-placeholder"></div>
```

**Características:**
- Links activos automáticos
- Menú mobile responsive
- Gestión de rutas

### Footer (`js/footer.js`)
Inyecta automáticamente el footer en el `#footer-placeholder`:
```html
<div id="footer-placeholder"></div>
```

### Lightbox (`js/lightbox.js`)
Sistema de galería con navegación por teclado:
- Click en imagen abre modal
- Flechas izquierda/derecha navegan
- ESC cierra la modal

### Scroll Animations (`js/scroll-animations.js`)
Anima elementos con clases:
- `.reveal-left` - Entra desde la izquierda
- `.reveal-right` - Entra desde la derecha
- `.reveal-up` - Entra desde abajo

---

## 🆕 Cómo Agregar Nuevas Páginas

### 1. Crear una Página de Proyecto

Copiar este template en `pages/nuevo-proyecto.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nombre Proyecto - Dylan Piserchia</title>
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <!-- Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- Global Styles -->
    <link rel="stylesheet" href="../css/variables.css">
    <link rel="stylesheet" href="../css/components.css">
    <link rel="stylesheet" href="../css/navbar.css">
    <link rel="stylesheet" href="../css/footer.css">

    <style>
        /* TUS ESTILOS ESPECÍFICOS AQUÍ */
    </style>
</head>
<body>
    <!-- Navbar Placeholder -->
    <div id="navbar-placeholder"></div>

    <main class="container">
        <!-- CONTENIDO DE LA PÁGINA -->
    </main>

    <!-- Footer Placeholder -->
    <div id="footer-placeholder"></div>

    <!-- Scripts -->
    <script src="../js/navbar.js"></script>
    <script src="../js/footer.js"></script>
    <script src="../js/scroll-animations.js"></script>
</body>
</html>
```

### 2. Agregar Link en index.html

En `index.html`, dentro de la sección `#projects`, agregá una tarjeta:

```html
<a href="pages/nuevo-proyecto.html" class="card">
    <div class="card-img-wrapper">
        <img src="assets/img/nueva-imagen.jpg" alt="Nuevo Proyecto" class="card-img">
    </div>
    <div class="card-content">
        <span class="card-category">CATEGORÍA • GÉNERO</span>
        <h3>Nombre del Proyecto</h3>
        <p>Descripción breve del proyecto.</p>
        
        <div class="card-footer">
            <div class="tags">
                <span class="tag">Tag1</span>
                <span class="tag">Tag2</span>
            </div>
            <span class="view-project">View <i class="fas fa-arrow-right"></i></span>
        </div>
    </div>
</a>
```

### 3. Agregar Link en Navbar

Editar `js/navbar.js`:

```javascript
const navHTML = `
    <nav>
        <div class="nav-container">
            <a href="index.html" class="nav-brand">DP.</a>
            <!-- ... -->
            <ul class="nav-links" id="navLinks">
                <li><a href="index.html">Home</a></li>
                <li><a href="pages/about.html">About</a></li>
                <li><a href="pages/nuevo-proyecto.html">Nuevo Proyecto</a></li>
            </ul>
        </div>
    </nav>
`;
```

---

## 📋 Estructura de una Página de Proyecto

### Layout Recomendado:

```html
<!-- Hero Section -->
<section class="hero-section">
    <div class="hero-content">
        <span class="project-tag">CATEGORÍA</span>
        <h1 class="hero-title">Nombre del Proyecto</h1>
        <p class="hero-description">Descripción...</p>
        <div class="mini-highlights">
            <!-- Highlights aquí -->
        </div>
    </div>
    <div class="hero-media-wrapper">
        <div class="hero-image" onclick="openLightbox(this.querySelector('img'))">
            <img src="..." alt="...">
        </div>
    </div>
</section>

<!-- Detail Section 1 -->
<section class="detail-section reveal-up">
    <div class="section-header">
        <h3>Sección 1</h3>
        <div class="header-line"></div>
    </div>
    <p class="section-intro">Introducción...</p>
    <div class="details-grid">
        <!-- Contenido en 2 columnas -->
    </div>
    <div class="gallery-grid">
        <!-- Galería de imágenes -->
    </div>
</section>
```

---

## 🎯 Clases Útiles

### Animaciones
```html
<!-- Aparecen cuando entran en viewport -->
<div class="reveal-left">Contenido</div>
<div class="reveal-right">Contenido</div>
<div class="reveal-up">Contenido</div>
```

### Grid y Layout
```html
<!-- Grid automático de tarjetas -->
<div class="grid">
    <div class="card">...</div>
</div>

<!-- Grid de galería -->
<div class="gallery-grid">
    <div class="gallery-item">...</div>
</div>
```

### Componentes
```html
<!-- Botón -->
<a href="#" class="btn btn-primary">Click me</a>

<!-- Etiqueta -->
<span class="tag">Tag</span>

<!-- Lista estilizada -->
<ul class="styled-list">
    <li>Elemento</li>
</ul>
```

---

## 🔧 Customización

### Cambiar Colores
Editar `css/variables.css`:
```css
:root {
    --accent: #00d4ff;           /* Color principal */
    --text-main: #e0e0e0;        /* Texto principal */
    --bg-dark: #080a0c;          /* Fondo */
}
```

### Cambiar Tipografía
Las fuentes se cargan desde Google Fonts en el `<head>` de cada página.

### Responsive
Todos los estilos incluyen breakpoints móviles (`@media (max-width: 768px)`).

---

## 📱 Mobile First

La estructura está optimizada para mobile:
- Navbar responsivo con menú hamburguesa
- Grid que se adapta a 1 columna en mobile
- Imágenes que respetan viewport
- Touch-friendly buttons

---

## ✅ Checklist para Nueva Página

- [ ] Crear archivo HTML en `pages/`
- [ ] Incluir links CSS correctos (con `../css/`)
- [ ] Agregar `<div id="navbar-placeholder"></div>`
- [ ] Agregar `<div id="footer-placeholder"></div>`
- [ ] Incluir scripts JS necesarios
- [ ] Agregar link en `index.html` dentro de `#projects`
- [ ] Actualizar navbar en `js/navbar.js`
- [ ] Añadir imágenes a `assets/img/`
- [ ] Testear en mobile y desktop

---

## 🚀 Deployment

Las páginas son estáticas y puedes deployar a:
- GitHub Pages
- Vercel
- Netlify
- Tu propio servidor web

Solo sube la carpeta completa sin cambios de rutas.

---

**Última actualización:** Enero 2025
