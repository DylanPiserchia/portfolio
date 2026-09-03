# -*- coding: utf-8 -*-
"""
Arma el sitio a partir de los archivos de content/.

    python tools/build.py

Por cada content/<nombre>.toml escribe pages/<nombre>.html, y ademas
regenera las tarjetas de la home y la lista de proyectos del menu del
celular. Lo que queda en el repo es HTML comun y corriente: lo que
subis es exactamente lo que se publica.

Para agregar un proyecto: copia content/_PLANTILLA.toml, editalo, y
corre este comando.

Solo necesita Python. Pillow es opcional (sirve para generar la imagen
de preview de LinkedIn): pip install pillow
"""

import html
import os
import re
import sys
import tomllib

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = os.path.join(ROOT, "content")
PAGES = os.path.join(ROOT, "pages")
IMG = os.path.join(ROOT, "assets", "img")

SITIO = "https://zenithardev.github.io/portfolio/"
AUTOR = "Dylan Piserchia"


# ---------------------------------------------------------------- utilidades

def esc(s):
    return html.escape(str(s or "").strip(), quote=True)


def texto(s):
    """Texto de contenido. Dos marcas, las unicas que hay que recordar:
         **negrita**   ->  <strong>
         *acento*      ->  el celeste del sitio
    """
    s = html.escape(str(s or "").strip(), quote=False)
    s = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", s)
    return re.sub(r"\*(.+?)\*", r'<span class="highlight-text">\1</span>', s)


def medidas(nombre):
    """width y height de una imagen de assets/img, para que no salte el layout."""
    ruta = os.path.join(IMG, nombre)
    if not os.path.exists(ruta):
        return None
    try:
        from PIL import Image
        with Image.open(ruta) as im:
            return im.size
    except Exception:
        return None


def aviso(msg):
    print("   aviso: " + msg)


# ---------------------------------------------------------------- bloques

def bloque_imagen(im, indent):
    """Una <div class="gallery-item"> de galeria o carousel."""
    archivo = im.get("archivo", "")
    externa = archivo.startswith("http")
    src = archivo if externa else "../assets/img/" + archivo

    attrs = ['loading="lazy"', 'decoding="async"']
    if not externa:
        wh = medidas(archivo)
        if wh:
            attrs.append('width="%d" height="%d"' % wh)
        elif not os.path.exists(os.path.join(IMG, archivo)):
            aviso("no encuentro assets/img/" + archivo)
    attrs.append('src="%s"' % esc(src))
    attrs.append('alt="%s"' % esc(im.get("alt", "")))
    if im.get("video"):
        attrs.append('data-video="%s"' % esc(im["video"]))

    p = " " * indent
    out = [p + '<div class="gallery-item" onclick="openLightbox(this.querySelector(\'img\'))">']
    out.append(p + "    <img " + " ".join(attrs) + ">")
    if im.get("video"):
        out.append(p + '    <div class="play-icon"><i class="fas fa-play-circle"></i></div>')
    if im.get("caption"):
        out.append(p + '    <div class="gallery-overlay"><span class="gallery-caption">%s</span></div>'
                   % texto(im["caption"]))
    out.append(p + "</div>")
    return "\n".join(out)


def bloque_galeria(imgs):
    cuerpo = "\n".join(bloque_imagen(i, 16) for i in imgs)
    return '            <div class="section-gallery">\n%s\n            </div>' % cuerpo


def bloque_carousel(imgs):
    cuerpo = "\n".join(bloque_imagen(i, 24) for i in imgs)
    return (
        '            <div class="carousel-container">\n'
        '                <button type="button" class="carousel-btn prev" aria-label="Imagen anterior" onclick="slideCarousel(-1, event)">\n'
        '                    <i class="fas fa-chevron-left"></i>\n'
        '                </button>\n'
        '\n'
        '                <div class="carousel-viewport">\n'
        '                    <div class="carousel-track">\n'
        '%s\n'
        '                    </div>\n'
        '                </div>\n'
        '\n'
        '                <button type="button" class="carousel-btn next" aria-label="Imagen siguiente" onclick="slideCarousel(1, event)">\n'
        '                    <i class="fas fa-chevron-right"></i>\n'
        '                </button>\n'
        '            </div>' % cuerpo
    )


def bloque_seccion(sec):
    sid = ' id="%s"' % esc(sec["id"]) if sec.get("id") else ""
    out = ['        <section%s class="detail-section reveal-up">' % sid]
    out.append('            <div class="section-header">')
    out.append("                <h3>%s</h3>" % texto(sec.get("titulo", "")))
    out.append('                <div class="header-line"></div>')
    out.append("            </div>")

    if sec.get("intro"):
        out.append('\n            <p class="section-intro">\n                %s\n            </p>'
                   % texto(sec["intro"]))

    lista = sec.get("lista") or []
    if lista or sec.get("impacto_texto"):
        out.append('\n            <div class="details-grid">')
        out.append('                <div class="details-column">')
        if sec.get("columna_titulo"):
            out.append("                    <h4>%s</h4>" % texto(sec["columna_titulo"]))
        if lista:
            out.append('                    <ul class="styled-list">')
            for li in lista:
                out.append("                        <li>%s</li>" % texto(li))
            out.append("                    </ul>")
        out.append("                </div>")
        out.append('                <div class="details-column">')
        if sec.get("impacto_texto"):
            out.append('                    <div class="impact-box">')
            if sec.get("impacto_titulo"):
                out.append("                        <h5>%s</h5>" % texto(sec["impacto_titulo"]))
            out.append("                        <p>%s</p>" % texto(sec["impacto_texto"]))
            out.append("                    </div>")
        out.append("                </div>")
        out.append("            </div>")

    if sec.get("carousel"):
        out.append("\n" + bloque_carousel(sec["carousel"]))
    elif sec.get("galeria"):
        out.append("\n" + bloque_galeria(sec["galeria"]))

    out.append("        </section>")
    return "\n".join(out)


def bloque_indice(d):
    secs = [s for s in d["seccion"] if s.get("id")]
    if not secs:
        return ""
    cards = []
    for n, s in enumerate(secs, 1):
        cards.append(
            '                <a href="#%s" class="index-card">\n'
            '                    <div class="index-number">%02d</div>\n'
            "                    <h3>%s</h3>\n"
            "                    <p>%s</p>\n"
            "                </a>" % (esc(s["id"]), n, texto(s.get("titulo", "")),
                                      texto(s.get("subtitulo", "")))
        )
    return (
        '        <section class="systems-index">\n'
        '            <h2 class="index-title">%s</h2>\n'
        '            <div class="index-grid">\n'
        "%s\n"
        "            </div>\n"
        "        </section>" % (texto(d.get("indice_titulo", "Systems Overview")), "\n".join(cards))
    )


def bloque_hero(d):
    hero = d.get("hero", {})
    out = ['        <section class="hero-section">']
    out.append('            <div class="hero-content reveal-left">')
    if hero.get("tag"):
        out.append('                <span class="project-tag">%s</span>' % texto(hero["tag"]))
    out.append('                <h1 class="hero-title">%s</h1>' % texto(hero.get("titulo", d.get("titulo", ""))))
    if hero.get("descripcion"):
        out.append('                <p class="hero-description">\n                    %s\n                </p>'
                   % texto(hero["descripcion"]))

    botones = d.get("boton") or []
    if botones:
        out.append('\n                <div class="action-buttons">')
        for b in botones:
            clase = "btn btn-primary" if b.get("primario") else "btn"
            icono = '<i class="%s"></i> ' % esc(b["icono"]) if b.get("icono") else ""
            out.append('                    <a href="%s" target="_blank" class="%s">\n'
                       "                        %s%s\n"
                       "                    </a>" % (esc(b.get("url", "#")), clase, icono, texto(b.get("texto", ""))))
        out.append("                </div>")

    panel = d.get("panel")
    if panel:
        out.append('\n                <div class="mini-highlights">')
        out.append("                    <h3>%s</h3>" % texto(panel.get("titulo", "")))
        if panel.get("intro"):
            out.append('                    <p class="panel-intro">\n                        %s\n                    </p>'
                       % texto(panel["intro"]))
        items = panel.get("item") or []
        if items:
            out.append('                    <ul class="highlight-list">')
            for it in items:
                fuerte = "<strong>%s:</strong> " % texto(it["fuerte"]) if it.get("fuerte") else ""
                out.append("                        <li>%s%s</li>" % (fuerte, texto(it.get("texto", ""))))
            out.append("                    </ul>")
        out.append("                </div>")
    out.append("            </div>")

    if hero.get("imagen"):
        archivo = hero["imagen"]
        attrs = ['decoding="async"', 'fetchpriority="high"']
        wh = medidas(archivo)
        if wh:
            attrs.append('width="%d" height="%d"' % wh)
        elif not os.path.exists(os.path.join(IMG, archivo)):
            aviso("no encuentro assets/img/" + archivo)
        attrs.append('src="../assets/img/%s"' % esc(archivo))
        attrs.append('alt="%s"' % esc(hero.get("alt", "")))
        if hero.get("video"):
            attrs.append('data-video="%s"' % esc(hero["video"]))

        out.append('\n            <div class="hero-media-wrapper reveal-right">')
        out.append('                <div class="hero-image" onclick="openLightbox(this.querySelector(\'img\'))">')
        out.append("                    <img " + " ".join(attrs) + ">")
        if hero.get("video"):
            out.append('                    <div class="play-icon"><i class="fas fa-play-circle"></i></div>')
        if hero.get("caption"):
            out.append('                    <div class="gallery-overlay">\n'
                       '                        <span class="gallery-caption">%s</span>\n'
                       "                    </div>" % texto(hero["caption"]))
        out.append("                </div>")
        out.append("            </div>")

    out.append("        </section>")
    return "\n".join(out)


# ---------------------------------------------------------------- pagina

CABECERA = """<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{titulo} - {autor}</title>
    <meta name="description" content="{descripcion}">
    <link rel="canonical" href="{sitio}pages/{slug}.html">

    <!-- Preview del link (LinkedIn, X, WhatsApp) -->
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="{autor} - Game Design Portfolio">
    <meta property="og:title" content="{titulo} - {autor}">
    <meta property="og:description" content="{descripcion}">
    <meta property="og:url" content="{sitio}pages/{slug}.html">
    <meta property="og:image" content="{sitio}assets/og/{slug}.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta name="twitter:card" content="summary_large_image">

    <link rel="icon" type="image/svg+xml" href="../assets/favicon.svg">
    <link rel="alternate icon" href="../assets/favicon.png">
    <meta name="theme-color" content="#0b0d10">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Roboto:wght@300;400;500;700&display=swap"
        rel="stylesheet">
    <!-- Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- Estilos -->
    <link rel="stylesheet" href="../css/variables.css">
    <link rel="stylesheet" href="../css/components.css">
    <link rel="stylesheet" href="../css/navbar.css">
    <link rel="stylesheet" href="../css/footer.css">
    <link rel="stylesheet" href="../css/level-system.css">
    <link rel="stylesheet" href="../css/page.css">
    <link rel="stylesheet" href="../css/project.css">
{extra_css}
    <link rel="stylesheet" href="../css/mobile.css">

    <script src="../js/analytics.js"></script>
</head>
"""

PIE = """
    <!-- Footer Placeholder -->
    <div id="footer-placeholder"></div>

    <!-- LIGHTBOX -->
    <div id="lightbox" class="lightbox" onclick="closeLightbox(event)">
        <button type="button" class="close-btn" aria-label="Cerrar" onclick="closeLightbox(event)">&times;</button>

        <button type="button" class="nav-btn prev" aria-label="Imagen anterior" onclick="changeImage(-1, event)">
            <i class="fas fa-chevron-left"></i>
        </button>

        <div class="lightbox-content-wrapper">
            <img decoding="async" class="lightbox-content" id="lightbox-img" alt="Lightbox View" style="display: block;">
            <iframe id="lightbox-video" class="lightbox-video" style="display: none;" src="" frameborder="0"
                allow="autoplay; encrypted-media" allowfullscreen></iframe>
        </div>

        <button type="button" class="nav-btn next" aria-label="Imagen siguiente" onclick="changeImage(1, event)">
            <i class="fas fa-chevron-right"></i>
        </button>
    </div>

    <script src="../js/projects.js"></script>
    <script src="../js/navbar.js"></script>
    <script src="../js/footer.js"></script>
    <script src="../js/scroll-animations.js"></script>
    <script src="../js/lightbox.js"></script>
    <script src="../js/carousel.js"></script>
    <script src="../js/accordion.js"></script>
</body>

</html>
"""


def render_pagina(slug, d):
    extra = ""
    for hoja in d.get("css_extra") or []:
        extra += '    <link rel="stylesheet" href="../css/%s.css">\n' % esc(hoja)

    cabecera = CABECERA.format(
        titulo=esc(d["titulo"]), autor=AUTOR, sitio=SITIO, slug=slug,
        descripcion=esc(re.sub(r"\*", "", d.get("resumen", ""))), extra_css=extra,
    )

    clases = ' class="project-compact"' if d.get("compacto") else ""
    partes = [cabecera, "<body%s>" % clases,
              '    <!-- Navbar Placeholder -->\n    <div id="navbar-placeholder"></div>\n',
              '    <main class="container">\n', bloque_hero(d)]

    if d.get("indice"):
        partes.append("\n" + bloque_indice(d))

    for sec in d.get("seccion") or []:
        partes.append("\n" + bloque_seccion(sec))

    partes.append("\n    </main>\n")

    if d.get("indice"):
        partes.append(
            '    <!-- Volver al indice -->\n'
            '    <button class="back-to-index" aria-label="Volver al índice"\n'
            "        onclick=\"document.querySelector('.systems-index').scrollIntoView({behavior: 'smooth'})\">\n"
            '        <i class="fas fa-th"></i>\n'
            "    </button>\n"
        )

    partes.append(PIE)
    return "\n".join(partes)


# ---------------------------------------------------------------- home y menu

def tarjeta(slug, d):
    portada = d.get("portada", "")
    wh = medidas(portada)
    dims = ' width="%d" height="%d"' % wh if wh else ""
    tags = "".join('\n                                <span class="tag">%s</span>' % esc(t)
                   for t in d.get("tags") or [])
    return (
        '                <a href="pages/%s.html" class="card">\n'
        '                    <div class="card-img-wrapper">\n'
        '                        <img loading="lazy" decoding="async"%s src="assets/img/%s" alt="%s" class="card-img">\n'
        "                    </div>\n"
        '                    <div class="card-content">\n'
        '                        <span class="card-category">%s</span>\n'
        "                        <h3>%s</h3>\n"
        "                        <p>%s</p>\n"
        "\n"
        '                        <div class="card-footer">\n'
        '                            <div class="tags">%s\n'
        "                            </div>\n"
        '                            <span class="view-project">View <i class="fas fa-arrow-right"></i></span>\n'
        "                        </div>\n"
        "                    </div>\n"
        "                </a>" % (slug, dims, esc(portada), esc(d["titulo"]),
                                  esc(d.get("categoria", "")), esc(d["titulo"]),
                                  texto(d.get("resumen", "")), tags)
    )


INICIO = "<!-- PROYECTOS: generado por tools/build.py, no editar a mano -->"
FIN = "<!-- FIN PROYECTOS -->"


def escribir_home(proyectos):
    path = os.path.join(ROOT, "index.html")
    s = open(path, encoding="utf-8").read()
    bloque = "%s\n%s\n            %s" % (
        INICIO, "\n\n".join(tarjeta(slug, d) for slug, d in proyectos), FIN)

    if INICIO in s and FIN in s:
        nuevo = re.sub(re.escape(INICIO) + r".*?" + re.escape(FIN), lambda m: bloque, s, flags=re.S)
    else:
        # primera vez: reemplaza el contenido de <div class="grid">
        m = re.search(r'(<div class="grid">\n)(.*?)(\n            </div>)', s, re.S)
        if not m:
            aviso("no encontre el <div class=\"grid\"> de index.html, no toco la home")
            return False
        nuevo = s[:m.start(2)] + "            " + bloque + s[m.end(2):]

    if nuevo != s:
        open(path, "w", encoding="utf-8").write(nuevo)
        return True
    return False


def og(slug, d):
    """Tarjeta de preview 1200x630 para LinkedIn. Necesita Pillow."""
    destino = os.path.join(ROOT, "assets", "og", slug + ".jpg")
    if os.path.exists(destino):
        return False
    try:
        from PIL import Image, ImageDraw, ImageFont, ImageFilter
    except ImportError:
        aviso("falta Pillow, no genero assets/og/%s.jpg (pip install pillow)" % slug)
        return False

    fuentes = [
        ("C:/Windows/Fonts/bahnschrift.ttf", "C:/Windows/Fonts/segoeuib.ttf", "C:/Windows/Fonts/consolab.ttf"),
        ("/Library/Fonts/Arial Bold.ttf",) * 3,
        ("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",) * 3,
    ]
    tipos = None
    for t in fuentes:
        if all(os.path.exists(f) for f in t):
            tipos = t
            break
    if not tipos:
        aviso("no encontre tipografias para armar assets/og/%s.jpg" % slug)
        return False

    origen = os.path.join(IMG, d.get("portada", ""))
    if not os.path.exists(origen):
        aviso("sin portada, no genero assets/og/%s.jpg" % slug)
        return False

    W, H = 1200, 630
    CYAN, OSCURO = (0, 212, 255), (11, 13, 16)

    im = Image.open(origen).convert("RGB")
    r = max(W / im.width, H / im.height)
    im = im.resize((round(im.width * r), round(im.height * r)), Image.LANCZOS)
    x, y0 = (im.width - W) // 2, (im.height - H) // 2
    lienzo = im.crop((x, y0, x + W, y0 + H)).filter(ImageFilter.GaussianBlur(1.2))

    velo = Image.new("L", (W, 1))
    for i in range(W):
        t = i / (W - 1)
        velo.putpixel((i, 0), int(238 - 150 * min(1.0, max(0.0, (t - 0.28) / 0.62))))
    lienzo = Image.composite(Image.new("RGB", (W, H), OSCURO), lienzo, velo.resize((W, H)))

    dr = ImageDraw.Draw(lienzo)
    dr.rectangle([0, 0, W, 6], fill=CYAN)

    def envolver(txt, f, ancho):
        palabras, lineas, act = txt.split(), [], ""
        for p in palabras:
            t = (act + " " + p).strip()
            if dr.textlength(t, font=f) <= ancho or not act:
                act = t
            else:
                lineas.append(act)
                act = p
        if act:
            lineas.append(act)
        return lineas

    margen, ancho = 76, 660
    f_ojo = ImageFont.truetype(tipos[2], 22)
    f_sub = ImageFont.truetype(tipos[1], 27)

    tam = 84
    while tam > 40:
        f_tit = ImageFont.truetype(tipos[0], tam)
        if len(envolver(d["titulo"], f_tit, ancho)) <= 2:
            break
        tam -= 4
    f_tit = ImageFont.truetype(tipos[0], tam)
    lineas = envolver(d["titulo"], f_tit, ancho)
    # el resumen se corta en la palabra entera mas cercana, no a la mitad
    limpio = re.sub(r"\s+", " ", re.sub(r"\*+", "", d.get("resumen", ""))).strip()
    if len(limpio) > 110:
        limpio = limpio[:110].rsplit(" ", 1)[0].rstrip(",.;:") + "…"
    sub = envolver(limpio, f_sub, ancho)

    y = (H - (34 + len(lineas) * (tam + 8) + 22 + len(sub) * 38)) // 2
    cx = margen
    for ch in d.get("categoria", "").upper():
        dr.text((cx, y), ch, font=f_ojo, fill=CYAN)
        cx += dr.textlength(ch, font=f_ojo) + 3
    y += 52
    for ln in lineas:
        dr.text((margen, y), ln, font=f_tit, fill=(255, 255, 255))
        y += tam + 8
    y += 14
    for ln in sub:
        dr.text((margen, y), ln, font=f_sub, fill=(176, 186, 198))
        y += 38

    dr.rectangle([margen, y + 18, margen + 64, y + 21], fill=CYAN)
    dr.text((margen, y + 40), SITIO.split("//")[1].rstrip("/").split("/")[0],
            font=ImageFont.truetype(tipos[2], 20), fill=(120, 132, 146))

    os.makedirs(os.path.dirname(destino), exist_ok=True)
    lienzo.save(destino, "JPEG", quality=86, optimize=True, progressive=True)
    return True


def escribir_menu(proyectos):
    path = os.path.join(ROOT, "js", "projects.js")
    entradas = []
    for slug, d in proyectos:
        entradas.append(
            "    {\n"
            "        titulo: %s,\n"
            "        categoria: %s,\n"
            "        archivo: '%s.html',\n"
            "        imagen: '%s'\n"
            "    }" % (repr(d["titulo"]).replace('"', "'"),
                       repr(d.get("categoria", "")).replace('"', "'"),
                       slug, d.get("portada", ""))
        )
    contenido = (
        "/* ===========================\n"
        "   LISTA DE PROYECTOS\n"
        "   La usa el menu de mobile para poder saltar de un proyecto a otro\n"
        "   sin volver a la home.\n"
        "\n"
        "   GENERADO POR tools/build.py A PARTIR DE content/ -- no editar a mano.\n"
        "   =========================== */\n"
        "\n"
        "window.PORTFOLIO_PROJECTS = [\n"
        "%s\n"
        "];\n" % ",\n".join(entradas)
    )
    if not os.path.exists(path) or open(path, encoding="utf-8").read() != contenido:
        open(path, "w", encoding="utf-8").write(contenido)
        return True
    return False


# ---------------------------------------------------------------- principal

def main():
    if not os.path.isdir(CONTENT):
        sys.exit("No existe la carpeta content/. Crea un .toml ahi adentro.")

    archivos = sorted(f for f in os.listdir(CONTENT)
                      if f.endswith(".toml") and not f.startswith("_"))
    if not archivos:
        sys.exit("No hay archivos .toml en content/.")

    proyectos = []
    for f in archivos:
        slug = f[:-5]
        try:
            d = tomllib.load(open(os.path.join(CONTENT, f), "rb"))
        except tomllib.TOMLDecodeError as e:
            sys.exit("Error de formato en content/%s:\n  %s" % (f, e))

        faltan = [k for k in ("titulo", "categoria", "portada", "resumen") if not d.get(k)]
        if faltan:
            sys.exit("A content/%s le faltan estos datos: %s" % (f, ", ".join(faltan)))

        print("%s.html" % slug)
        salida = os.path.join(PAGES, slug + ".html")
        nuevo = render_pagina(slug, d)
        anterior = open(salida, encoding="utf-8").read() if os.path.exists(salida) else None
        if nuevo != anterior:
            open(salida, "w", encoding="utf-8").write(nuevo)
            print("   escrita")
        else:
            print("   sin cambios")

        if og(slug, d):
            print("   assets/og/%s.jpg generada" % slug)

        orden = d.get("orden", 999)
        proyectos.append((orden, slug, d))

    proyectos.sort(key=lambda p: (p[0], p[1]))
    lista = [(slug, d) for _, slug, d in proyectos]

    print("index.html", "actualizado" if escribir_home(lista) else "sin cambios")
    print("js/projects.js", "actualizado" if escribir_menu(lista) else "sin cambios")

    # Si borraste un .toml, la pagina vieja sigue publicada: hay que avisar.
    generadas = {slug + ".html" for _, slug, _ in proyectos}
    for f in sorted(os.listdir(PAGES)):
        if f.endswith(".html") and f != "about.html" and f not in generadas:
            aviso("pages/%s ya no tiene su archivo en content/. "
                  "Si no lo querés mas, borralo a mano." % f)
    print("\nListo. Mira como quedo con:  python -m http.server 8000")


if __name__ == "__main__":
    main()
