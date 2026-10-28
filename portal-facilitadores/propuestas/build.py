"""Arma las tres propuestas del portal de partners.

Lee partners.json y las fotos de fotos/, y escribe:
  - ghl-a-directorio.html, ghl-b-vitrina.html, ghl-c-muro.html  (bloques Custom Code para GHL)
  - vista-previa.html  (las tres juntas, con selector, para revisar)
Uso: python3 build.py <ruta-logo.b64> <carpeta-salida-vista-previa>
"""
import base64, json, pathlib, sys

AQUI = pathlib.Path(__file__).parent
logo = pathlib.Path(sys.argv[1]).read_text().strip()
salida = pathlib.Path(sys.argv[2])

partners = json.loads((AQUI / "partners.json").read_text())
for p in partners:
    f = AQUI / "fotos" / p.get("foto_archivo", "")
    if p.get("foto_archivo") and f.exists():
        mime = "image/png" if f.suffix == ".png" else "image/jpeg"
        p["foto"] = f"data:{mime};base64," + base64.b64encode(f.read_bytes()).decode()
    p.pop("foto_archivo", None)

base_css = (AQUI / "base.css").read_text()
comun_js = (AQUI / "comun.js").read_text()

def bloque(nombre):
    cuerpo = (AQUI / f"{nombre}.html").read_text()
    datos = json.dumps(partners, ensure_ascii=False)
    return (cuerpo.replace("__LOGO__", logo)
                  .replace("/*__BASE_CSS__*/", base_css)
                  .replace("/*__COMUN_JS__*/", comun_js)
                  .replace("/*__PARTNERS__*/[]", datos))

archivos = {"a": "ghl-a-directorio", "b": "ghl-b-vitrina", "c": "ghl-c-muro"}
bloques = {}
for k, n in archivos.items():
    bloques[k] = bloque(n)
    (AQUI / f"{n}.final.html").write_text(bloques[k])

marco = (AQUI / "marco.html").read_text()
pagina = (marco.replace("<!--A-->", bloques["a"])
               .replace("<!--B-->", bloques["b"])
               .replace("<!--C-->", bloques["c"])
               .replace("<!--FORM-->", (AQUI / "formulario.html").read_text()))
salida.mkdir(parents=True, exist_ok=True)
(salida / "partners-propuestas.html").write_text(pagina)
print("ok", len(pagina))
