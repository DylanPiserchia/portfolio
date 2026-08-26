"""
Convierte a WebP las imagenes nuevas de assets/img y guarda los originales
en assets/img/_originals/.

Uso:
    1. Copia tus PNG/JPG en assets/img/
    2. python tools/optimize-images.py
    3. En el HTML referencia el archivo .webp

Solo toca los archivos que todavia no tienen su version .webp, asi que
podes correrlo las veces que quieras.

Requiere Pillow:  pip install pillow
"""

import os
import glob
import shutil
import sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, "assets", "img")
ORIGINALS = os.path.join(IMG, "_originals")

MAX_WIDTH = 1600   # suficiente para verlas a pantalla completa en el lightbox
QUALITY = 82       # 82 es el punto donde no se nota la perdida


def optimize(path):
    name, _ = os.path.splitext(os.path.basename(path))
    out_path = os.path.join(IMG, name + ".webp")

    if os.path.exists(out_path):
        return None  # ya convertida

    src_size = os.path.getsize(path)
    im = Image.open(path)
    width, height = im.size

    keep_alpha = False
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        keep_alpha = im.getchannel("A").getextrema()[0] < 255

    if width > MAX_WIDTH:
        im = im.resize((MAX_WIDTH, round(height * MAX_WIDTH / width)), Image.LANCZOS)

    im.convert("RGBA" if keep_alpha else "RGB").save(
        out_path, "WEBP", quality=QUALITY, method=6)

    os.makedirs(ORIGINALS, exist_ok=True)
    shutil.move(path, os.path.join(ORIGINALS, os.path.basename(path)))

    return name + ".webp", src_size, os.path.getsize(out_path), im.size


def main():
    pending = [p for p in sorted(glob.glob(os.path.join(IMG, "*")))
               if os.path.isfile(p) and os.path.splitext(p)[1].lower() in (".png", ".jpg", ".jpeg")]

    if not pending:
        print("No hay imagenes nuevas en assets/img/ (todo ya esta en WebP).")
        return

    before = after = 0
    for path in pending:
        result = optimize(path)
        if not result:
            print("ya existia el .webp, salteo:", os.path.basename(path))
            continue
        out_name, src_size, dst_size, size = result
        before += src_size
        after += dst_size
        print(f'{out_name:34s} {src_size // 1024:6d} KB -> {dst_size // 1024:5d} KB   width="{size[0]}" height="{size[1]}"')

    if before:
        print(f"\nTotal: {before / 1024 / 1024:.1f} MB -> {after / 1024 / 1024:.1f} MB")
        print("Los originales quedaron en assets/img/_originals/")


if __name__ == "__main__":
    try:
        main()
    except ImportError:
        sys.exit("Falta Pillow. Instalalo con: pip install pillow")
