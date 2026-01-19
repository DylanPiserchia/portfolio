# 🚀 Quick Start - Agregar Nuevos Proyectos

## 5 Pasos Simples

### 1️⃣ Copiar Template
```bash
# Copiar pages/PROJECT_TEMPLATE.html a pages/mi-nuevo-proyecto.html
```

### 2️⃣ Editar Metadatos
```html
<title>[TITULO] - Dylan Piserchia</title>
<!-- Reemplazar [TITULO] con el nombre del proyecto -->
```

### 3️⃣ Reemplazar Placeholders
En la página que copiaste, busca y reemplaza:

| Placeholder | Cambiar por | Ejemplo |
|--|--|--|
| `[TITULO]` | Nombre del proyecto | "Star Trek: Infinite" |
| `[CATEGORIA]` | Género/Tipo | "AAA • Grand Strategy" |
| `[DESCRIPCION]` | Descripción breve | "Led system design for..." |
| `[IMAGEN_HERO]` | Nombre de imagen | "STI_img1.jpg" |

### 4️⃣ Agregar en index.html
En `index.html`, sección `#projects`, agrega:

```html
<a href="pages/mi-nuevo-proyecto.html" class="card">
    <div class="card-img-wrapper">
        <img src="assets/img/mi-imagen.jpg" alt="Mi Proyecto" class="card-img">
    </div>
    <div class="card-content">
        <span class="card-category">CATEGORÍA</span>
        <h3>Mi Proyecto</h3>
        <p>Descripción breve aquí...</p>
        
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

### 5️⃣ (Opcional) Agregar a Navbar
Si quieres que aparezca en el menú, edita `js/navbar.js`:

```javascript
<ul class="nav-links" id="navLinks">
    <li><a href="index.html">Home</a></li>
    <li><a href="pages/about.html">About</a></li>
    <li><a href="pages/mi-nuevo-proyecto.html">Mi Proyecto</a></li>
</ul>
```

---

## 📝 Estructura Recomendada de Proyecto

Cada página de proyecto debería tener:

```
1. HERO SECTION
   - Tag de categoría
   - Título principal
   - Descripción
   - Key highlights
   - Imagen hero

2. SECTION 1
   - Título
   - Introducción
   - 2 columnas (Features + Impact Box)
   - Galería de 3 imágenes

3. SECTION 2
   - Título
   - Introducción
   - 2 columnas (Features + Implementation Box)
   - Galería de 2-3 imágenes

(Puedes agregar más secciones si es necesario)
```

---

## 🖼️ Galería de Videos

Para agregar un video de YouTube en lugar de una imagen:

```html
<div class="gallery-item" onclick="openLightbox(this.querySelector('img'))">
    <img src="../assets/img/thumbnail.png" 
         alt="Video" 
         data-video="https://www.youtube.com/embed/VIDEOID">
    <div class="play-icon"><i class="fas fa-play-circle"></i></div>
    <div class="gallery-overlay"><span class="gallery-caption">Trailer</span></div>
</div>
```

⚠️ Importante: El `data-video` debe ser de YouTube usando formato `embed`:
- ✅ `https://www.youtube.com/embed/dQw4w9WgXcQ`
- ❌ `https://www.youtube.com/watch?v=dQw4w9WgXcQ`

---

## 📂 Archivo de Imágenes

Siempre guardar imágenes en: `assets/img/`

**Nombres recomendados:**
```
proyecto-nombre_img1.jpg
proyecto-nombre_img2.jpg
proyecto-nombre_hero.jpg
proyecto-nombre_video_thumbnail.png
```

---

## 🎨 Clases Útiles para Diseño

### Animaciones de Scroll
```html
<section class="reveal-up">
    <!-- Aparece con animación cuando entra en viewport -->
</section>

<div class="reveal-left">Entra desde la izquierda</div>
<div class="reveal-right">Entra desde la derecha</div>
```

### Listas Estilizadas
```html
<ul class="styled-list">
    <li>Elemento 1</li>  <!-- Marca con ">" -->
    <li>Elemento 2</li>
</ul>
```

### Botones
```html
<a href="#" class="btn btn-primary">Botón Primario</a>
<a href="#" class="btn btn-secondary">Botón Secundario</a>
```

### Etiquetas
```html
<span class="tag">Tag 1</span>
<span class="tag">Tag 2</span>
```

---

## 🔍 Checklist Final

Antes de publicar una nueva página:

- [ ] ¿Todos los `[PLACEHOLDERS]` fueron reemplazados?
- [ ] ¿Las rutas relativas están correctas? (`../css/`, `../js/`)
- [ ] ¿Las imágenes existen en `assets/img/`?
- [ ] ¿Agregaste el link en `index.html`?
- [ ] ¿Los estilos se cargan correctamente?
- [ ] ¿La página se ve bien en mobile?
- [ ] ¿El lightbox funciona con todas las imágenes?
- [ ] ¿Los links del navbar funcionan?

---

## 💡 Ejemplos Rápidos

### Agregar Imagen con Click
```html
<div class="hero-image" onclick="openLightbox(this.querySelector('img'))">
    <img src="../assets/img/mi-imagen.jpg" alt="Descripción">
</div>
```

### Agregar Highlight Box
```html
<div class="highlight-box">
    <h5>Título</h5>
    <p>Contenido aquí...</p>
</div>
```

### Agregar Mini Highlights
```html
<div class="mini-highlights">
    <h3>Key Highlights</h3>
    <ul class="highlight-list">
        <li><strong>Punto 1:</strong> Descripción</li>
        <li><strong>Punto 2:</strong> Descripción</li>
    </ul>
</div>
```

---

**¡Listo! Ya puedes agregar nuevos proyectos fácilmente.** 🎉
