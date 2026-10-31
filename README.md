# SOGOTI · Web corporativa

Sitio estático (HTML + CSS + JS, sin frameworks ni compilación) de SOGOTI, especialistas en AVEVA PI System.

## Estructura

```
sogoti-web/
├── index.html              Inicio: dashboard en vivo, indicadores, problema, resumen y diagnóstico
├── servicios/index.html    Servicios, cómo trabajamos y diagnóstico con arquitectura PI
├── desarrollo/index.html   Desarrollo sobre PI System
├── soluciones/index.html   Ruta de madurez del dato, analítica predictiva e IA
├── casos/index.html        Casos y comparativa
├── nosotros/index.html     Empresa, indicadores, credenciales y gestión de proyectos
├── contacto/index.html     Formulario (Netlify Forms) y preguntas frecuentes
├── 404.html
├── assets/
│   ├── css/styles.css      Tokens de color (tema claro y oscuro) y estilos
│   ├── js/main.js          Tema, menú, dashboard, pestañas y formulario
│   └── img/                favicon.svg, og.png (imagen para redes)
├── netlify.toml            Configuración y cabeceras de seguridad para Netlify
├── robots.txt · sitemap.xml
└── .nojekyll               Necesario para GitHub Pages
```

El encabezado y el pie se repiten en cada página: si cambia un enlace o el teléfono, búsquelo y reemplácelo en todos los `index.html`.

## Ver en local

Las páginas usan rutas de carpeta (`servicios/`), así que conviene un servidor local:

```bash
cd sogoti-web
python -m http.server 8000
# abrir http://localhost:8000
```

## 1. Subir a GitHub

```bash
cd sogoti-web
git init
git add .
git commit -m "Web SOGOTI v1"
git branch -M main
git remote add origin https://github.com/<su-usuario>/sogoti-web.git
git push -u origin main
```

(También puede crear el repositorio en github.com y arrastrar los archivos con "Add file → Upload files".)

## 2. Publicar en Netlify (recomendado)

1. Entre a app.netlify.com e inicie sesión con su cuenta de GitHub.
2. **Add new site → Import an existing project → GitHub** y elija `sogoti-web`.
3. Build command: vacío. Publish directory: `.` (ya está en `netlify.toml`). **Deploy**.
4. **Site configuration → Change site name** → `sogoti` (o el nombre disponible). La web queda en `https://<nombre>.netlify.app`.
5. Cada `git push` a `main` vuelve a publicar automáticamente.

### Formulario de contacto
- En Netlify funciona sin código adicional (Netlify Forms). Requiere **Forms → Enable form detection** (ya activado en `sogoti.netlify.app`) y un deploy posterior; el formulario aparece en **Forms → contacto**.
- Para recibir avisos por correo: **Site configuration → Notifications → Emails and webhooks → Form submission notifications** y ponga su correo (Gmail/Outlook sirve).
- Si el envío falla, el formulario ofrece mandar la solicitud por WhatsApp.
- Alternativa (por ejemplo en GitHub Pages): cree una clave en Web3Forms o un formulario en Formspree y coloque su URL en `FORM_ENDPOINT` dentro de `assets/js/main.js`.

## 3. Alternativa: GitHub Pages
**Settings → Pages → Deploy from a branch → `main` / root**. Queda en `https://<su-usuario>.github.io/sogoti-web/`. Ahí Netlify Forms no existe: el formulario usará WhatsApp o `FORM_ENDPOINT`.

## 4. Antes y después de tener dominio
- Si el nombre en Netlify no es `sogoti`, reemplace `https://sogoti.netlify.app` en todos los archivos (`canonical`, `og:url`, `og:image`, `sitemap.xml`, `robots.txt`).
- Con dominio propio: **Domain management → Add a domain** en Netlify, siga las instrucciones DNS y vuelva a reemplazar la URL base por `https://sogoti.com`.
- Con dominio, considere volver a agregar el correo comercial y la nota "AVEVA y PI System son marcas registradas de AVEVA Group Limited." en el pie.

## Tema
El sitio abre en tema claro; el botón de luna/sol cambia a oscuro y recuerda la elección del visitante.
