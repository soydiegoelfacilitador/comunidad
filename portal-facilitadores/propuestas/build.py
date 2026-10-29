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

# --- Kit de despliegue: la versión real (propuesta A) y la página del formulario ---
import html, re
FORM_URL = "/suma-tu-perfil"
RAIZ = AQUI.parent
deploy = RAIZ / "deploy"
deploy.mkdir(exist_ok=True)
portal = bloques["a"].replace("__FORM_URL__", FORM_URL)
arriba = (RAIZ / "formulario" / "ghl-form-arriba.html").read_text().replace("__LOGO__", logo)
abajo = (RAIZ / "formulario" / "ghl-form-abajo.html").read_text()
(deploy / "portal-partners.html").write_text(portal)
(deploy / "form-arriba.html").write_text(arriba)
(deploy / "form-abajo.html").write_text(abajo)

form_src = (AQUI / "formulario.html").read_text()
form_css = re.search(r"<style>.*?</style>", form_src, re.S).group(0).replace("#efp-f", ".efp-fake")
form_el = re.search(r"<form .*?</form>", form_src, re.S).group(0)
kit = (AQUI / "kit.html").read_text()
kit = (kit.replace("<!--PORTAL-->", portal)
          .replace("<!--FORM-->", arriba + form_css + '<div class="efp efp-fake"><div class="grid-light" style="padding:0 16px">' + form_el + "</div></div>" + abajo)
          .replace("__CODE_PORTAL__", html.escape(portal))
          .replace("__CODE_ARRIBA__", html.escape(arriba))
          .replace("__CODE_ABAJO__", html.escape(abajo)))
(salida / "partners-kit.html").write_text(kit)
print("kit", len(kit))
