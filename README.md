# Cats API – Frontend (Vite + React + TypeScript)

Frontend para una API de razas de gatos. Incluye login/registro con JWT, rutas protegidas, listado con scroll infinito, búsqueda, detalle por ID, modal con info completa, página de imágenes por raza (DTO), Swagger embebido, layout + header con logout y favicon 🐱.

---

## 🎯 Características

- Autenticación
  - POST /auth/login y POST /auth/register (registro hace auto-login).
  - Interceptor Axios omite `Authorization` en /auth/*.
  - Contexto guarda `{ token, ...user }` y persiste `authToken` con `expiresAt` (60 min).

- UI / Paleta
  - Fondo: bg-stone-50 · Texto: text-gray-800/600 · Botón: bg-amber-100 hover:bg-amber-200 text-gray-900 · Acento: text-yellow-600.
  - shadcn/ui + Tailwind (Cards, Button, Dialog, Input, etc.).

- Rutas y páginas
  - /login — Iniciar sesión.
  - /register — Registro con auto-login.
  - /docs — Swagger embebido en iframe.
  - /breeds — Lista con scroll infinito + modal.
  - /breeds/search — Búsqueda (GET /breeds/search?q=&attach_image=1).
  - /breeds/by-id — Buscador por ID/nombre (UI).
  - /breeds/:breed_id — Detalle por ID (usa el mismo modal).
  - /images/by-breed — Imágenes por raza (GET /imagesbybreedid) con todos los parámetros del DTO: `breed_id`, `limit`, `size`, `mime_types`, `order`, `page`, `include_breeds`, `has_breeds`.

- Header & Layout
  - Header con atajos (Breeds, Search, By-ID, Images) + Logout.
  - Layout central con contenedor `max-w-7xl`.

- Favicon
  - Emoji 🐱 (public/cat.svg).

---

## 🧱 Stack

Vite + React + TypeScript  
TailwindCSS + shadcn/ui  
React Router v6  
Axios (servicio con interceptor JWT)  
Context API (sesión en localStorage)  
Despliegue pensado para Vercel

---

## 📁 Estructura

src/  
• AppRouter.tsx  
• layout/IntLayaout.tsx  
• routes/ProtectedRoute.tsx, routes/Shell.tsx  
• context/UserDetailContext.tsx  
• services/catsApi.ts  
• components/AppHeader.tsx, components/BreedCard.tsx, components/BreedModal.tsx  
• pages/Login.tsx, pages/Register.tsx, pages/SwaggerDocsPage.tsx, pages/BreedsPage.tsx (infinite scroll), pages/BreedsSearchPage.tsx, pages/BreedDetailPage.tsx (/by-id y /:breed_id), pages/ImagesByBreedPage.tsx (DTO)  
public/cat.svg  
vercel.json (rewrites /api + fallback SPA)  
vite.config.ts (alias @ + proxy dev /api)

---

## ⚙️ Configuración

1) Instalación  
   Ejecuta: `pnpm i`  (o `npm i` / `yarn`)

2) Variables de entorno (archivo **.env** para desarrollo)  

VITE_SWAGGER_URL=https://vf9voa0cfd.execute-api.us-east-1.amazonaws.com/docs

(Si NO usarás proxy /api en dev)
VITE_API_URL=https://vf9voa0cfd.execute-api.us-east-1.amazonaws.com

3) Proxy de Vite (evita CORS en local)  
En **vite.config.ts** asegúrate de tener:  
• alias @ → src  
• proxy:
  - clave: **/api**  
  - target: **https://vf9voa0cfd.execute-api.us-east-1.amazonaws.com**  
  - changeOrigin: true  
  - rewrite: reemplazar `^/api` por cadena vacía

4) Servicio Axios (resumen)  
• baseURL: `'/api'` tanto en dev como en prod (Vercel reescribe).  
• interceptor request:  
  - si la URL comienza con **/auth/** (login, register), NO añadir Authorization.  
  - en el resto, leer `authToken` de localStorage y añadir `Authorization: Bearer <token>`.  
  - asegurar `Content-Type: application/json`.

5) Contexto de sesión  
• Persistir `userDetail` y `authToken` en localStorage.  
• `authToken = { token, expiresAt }` donde expiresAt = ahora + 60 min.  
• Efecto que revisa cada minuto si expiró para cerrar sesión (limpia storage y navega a “/”).

---

## 🔀 Router (resumen)

Rutas públicas:  
• /login  
• /register

Rutas privadas (envueltas por ProtectedRoute + Shell/IntLayaout):  
• /docs  
• /breeds  
• /breeds/search  
• /breeds/by-id  
• /breeds/:breed_id  
• /images/by-breed

Raíz: `/` → redirige a `/docs` (puedes cambiar a `/breeds` si prefieres).  
Wildcard 404: redirige a `/breeds`.

---

## 🧩 Páginas / Componentes

**Login / Register**  
• Validaciones mínimas, estados de carga/error.  
• Register hace auto-login con `{ user, accessToken }`.

**Breeds**  
• `/breeds`: listado con IntersectionObserver (carga por lotes) + filtro local.  
• `BreedCard`: imagen, nombre, origen, vida, enlace a Wiki.  
• `BreedModal` (Dialog): imagen; descripción; chips de temperamento; datos básicos (vida, peso, flags); barras 1–5 (adaptability, dog_friendly, etc.); enlaces (Wikipedia, CFA, Vetstreet, VCA).  
• `/breeds/search`: `GET /breeds/search?q=&attach_image=1` con debounce y modal.  
• `/breeds/by-id`: buscador por nombre/ID que navega a `/breeds/:id`.  
• `/breeds/:breed_id`: detalle por ID + modal.

**Images by Breed**  
• `/images/by-breed`: `GET /imagesbybreedid` con parámetros del DTO (breed_id obligatorio, limit 1–25, size thumb/small/med/full, mime_types, order RANDOM/ASC/DESC, page, include_breeds, has_breeds).  
• Grid de imágenes; si la respuesta trae `breeds`, abre `BreedModal` con la info de esa raza.  
• Botón “Cargar más” incrementa page y añade resultados.

**Swagger**  
• `/docs`: muestra `VITE_SWAGGER_URL` en un iframe con controles “Recargar” y “Abrir en pestaña”.  
• Nota: si el servidor de Swagger bloquea iframes (X-Frame-Options / CSP frame-ancestors), abrir en pestaña o renderizar con swagger-ui-react en el front.

**Header & Layout**  
• Header con links a Breeds (lista / buscar / by-id), Images y Logout.  
• Responsive con menú móvil.  
• `IntLayaout`: contenedor principal `bg-stone-50`, contenido centrado, padding alto bajo el header.

**Favicon**  
• Archivo `public/cat.svg` con un emoji 🐱.  
• En `index.html` reemplazar el favicon por `/cat.svg`.

---

## 🧾 Tipado Breed (extracto útil en el servicio)

Propiedades comunes usadas por la app:  
`id` (string), `name` (string), `origin` (string?), `description` (string?), `temperament` (string?), `life_span` (string?), `image` (url opcional), `weight` (metric/imperial opcionales), enlaces (`wikipedia_url`, `cfa_url`, `vetstreet_url`, `vcahospitals_url`), flags (`indoor`, `hypoallergenic`, etc.), atributos 1–5 (`adaptability`, `dog_friendly`, `energy_level`, `intelligence`, etc.).  
Consejo: define una interfaz `Breed` con esos campos opcionales y un índice `[k: string]: unknown` para tolerar campos extra.

---

## ▲ Despliegue en Vercel

**vercel.json** (dos rewrites, en este orden):  
1) Reescritura de API:  
- `source`: `/api/(.*)`  
- `destination`: `https://vf9voa0cfd.execute-api.us-east-1.amazonaws.com/$1`  
(Evita CORS: la app llama a /api y Vercel lo reenvía a tu API real).

2) Fallback SPA:  
- `source`: `/(.*)`  
- `destination`: `/`  
(Cualquier ruta sirve index.html para que el router del front resuelva).

**Variables en Vercel**:  
• `VITE_SWAGGER_URL` (para /docs).  
• *(Opcional)* `VITE_API_URL` si prefieres llamar directo a la API en lugar del rewrite /api. Si haces esto, habilita CORS para tu dominio de Vercel en el backend.

**Problemas comunes y soluciones**:  
• **405 Method Not Allowed** en /api/... en producción → falta el rewrite de /api o está después del fallback. Ponlo primero.  
• **404 NOT_FOUND** al abrir o refrescar /register → falta el fallback SPA /(.*) → /.  
• **CORS** en dev → usa el proxy de Vite /api (no llames directo al dominio de AWS).  
• **CORS** en prod llamando directo al dominio de AWS → habilita CORS en el backend o usa el rewrite /api.  
• **Registro falla** pero Postman funciona → estabas enviando Authorization a /auth/register. El interceptor debe omitirlo.

---

## 🧪 Scripts

Comandos habituales del proyecto:  
• `pnpm dev` (o `npm run dev` / `yarn dev`)  
• `pnpm build`  
• `pnpm preview`

---

## 📜 Licencia

MIT — úsalo, modifícalo y compártelo libremente.
MD
