# Portal de Partners en GoHighLevel

Dos páginas en el mismo embudo o sitio de GHL:

| Página | Ruta sugerida | Qué lleva |
|---|---|---|
| Portal de Partners | `/partners` | 1 elemento Custom Code con `deploy/portal-partners.html` |
| Suma tu perfil | `/partners/suma-tu-perfil` | Custom Code `deploy/form-arriba.html` → formulario nativo "Perfil de partner" → Custom Code `deploy/form-abajo.html` |

Cada Custom Code va en una sección a todo el ancho, sin márgenes ni padding.

## 1. Campos personalizados del contacto

Ajustes → Campos personalizados → carpeta "Perfil de partner":

| Campo | Tipo | Notas |
|---|---|---|
| Foto de partner | Carga de archivos | 1 archivo, JPG o PNG |
| Cargo partner | Texto de una línea | "Facilitador · Gestión comunitaria" |
| Especialidad principal | Desplegable (opción única) | Gestión comunitaria, Planificación estratégica, Talento e innovación, Workshops, Reuniones efectivas, Equipos y cultura, Dinámicas lúdicas, Otra |
| Otras especialidades | Casillas | Sector público, Consultoría, Grandes empresas, Retrospectivas, Onboarding, Facilitación online |
| Programa con la Escuela | Desplegable (opción única) | Facilitación de Workshops Ágiles, Reuniones Geniales, Juega y Transforma, Héroes, Acelerador, Facilitación Avanzada, Entrenamiento en tu empresa, Otro |
| Año del programa | Número | |
| Habilidades certificadas | Casillas | Las 18 del mapa de competencias (lista abajo) |
| Bio de partner | Texto de varias líneas | Máximo 300 caracteres |
| Frase de partner | Texto de una línea | Opcional |
| LinkedIn | Texto de una línea | URL |
| Link 1 · nombre / Link 1 · URL | Texto de una línea | Web, portafolio, YouTube o Instagram |
| Link 2 · nombre / Link 2 · URL | Texto de una línea | Opcional |
| Acepto publicar mi perfil | Casilla única | Obligatoria |

El WhatsApp usa el campo estándar Teléfono, con selector de país.

Habilidades certificadas (las 18 del mapa): Comunicación clara, Generación de confianza, Creatividad, Pensamiento sistémico, Manejo de conflicto, Gestión emocional, Adaptabilidad, Formulación de preguntas, Escucha activa, Diseño centrado en usuarios, Claridad metodológica, Gestión del espacio, Encuadre, Lectura del grupo, Pensamiento visual, Gestión del tiempo, Foco en productos, Apertura al feedback.

## 2. Formulario "Perfil de partner"

Sitios → Formularios → Crear. Campos en este orden: Nombre completo, Correo, Foto, Cargo, Especialidad principal, Otras especialidades, Programa, Año, Habilidades certificadas, Bio, Frase, LinkedIn, Teléfono (WhatsApp), Link 1, Link 2, Acepto publicar. Botón: ENVIAR MI PERFIL.

Estilo (igual que el portal de Empresas): fuente Ubuntu, campos de 48 px de alto con borde #d9d9d9 y radio 8 px, botón píldora #165dfc con texto blanco en negrita. Al enviar: mensaje "¡Listo! Revisamos tu perfil y te avisamos por WhatsApp cuando esté publicado."

Como el correo es el identificador del contacto, si alguien vuelve a enviar el formulario se actualiza su mismo contacto.

## 3. Workflows

**A · Llega un perfil:** disparador Formulario enviado (Perfil de partner) → Agregar etiqueta `partner-pendiente` → Notificación interna a Diego con el link al contacto.

**B · Publicar:** disparador Etiqueta agregada `partner-publicado` → Google Sheets: Crear o actualizar fila (buscar por correo) en la hoja "Partners" → Quitar etiqueta `partner-pendiente` → WhatsApp o SMS: "¡Tu perfil ya está en el Portal de Partners!".

Antes de poner `partner-publicado`, revisa en el contacto que el programa y las habilidades marcadas sean las que de verdad certificó la Escuela.

La acción de Google Sheets es una acción premium de los workflows de GHL.

## 4. Hoja de Google "Partners"

Fila 1, en este orden:

`publicado, correo, nombre, foto, cargo, especialidad, especialidades, bio, cita, programa, habilidades, linkedin, whatsapp, link1_nombre, link1_url, link2_nombre, link2_url`

- `publicado`: "SI" para que aparezca. Escribe "NO" para sacar a alguien sin borrarlo.
- Las listas (especialidades, habilidades) van separadas por punto y coma.
- `programa`: por ejemplo "Héroes · 2025".
- `foto`: el link del archivo que deja el campo de carga. Revisa que abra sin iniciar sesión. Si no abre, sube la foto a la Media Library y pega ese link.

Después: Archivo → Compartir → Publicar en la web → la hoja "Partners" → CSV → Publicar. Copia el link y pégalo en `SHEET_CSV` (al inicio del script de `deploy/portal-partners.html`). Desde ahí el portal lee la hoja y ya no usa los perfiles escritos a mano.

La hoja publicada la puede ver cualquiera con el link: no pongas columnas que no se muestran en el portal, salvo el correo, que el portal no muestra. Si no quieres que el correo sea visible ni siquiera en la hoja, quítalo de la hoja publicada y busca la fila por nombre.

## 5. Mientras no esté la hoja

`deploy/portal-partners.html` trae cargados a Álvaro, Walter y Diego Oliva con sus fotos incrustadas. Funciona tal cual. Para editar esos perfiles: `propuestas/partners.json` → `python3 propuestas/build.py <logo.b64> <carpeta>`.
