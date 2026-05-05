<div align="center">
  <h1>🎬 Movie Review Web</h1>
  <p>
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  </p>
  <strong>Aplicación web para registrarse, iniciar sesión con JWT, explorar películas y series desde TMDb, y crear reseñas conectadas al backend del proyecto.</strong>
</div>

---

## 🚀 Funcionalidades

En este repositorio encontrarás la interfaz web de Movie Review:

**🔐 Autenticación con JWT**: permite registrarse e iniciar sesión contra la API, persistiendo token y usuario en `localStorage`.

**🛡️ Rutas protegidas**: el home, buscador, detalle y perfil solo están disponibles para usuarios autenticados.

**🔍 Búsqueda de películas y series**: integra consultas a TMDb con debounce para evitar requests innecesarias mientras el usuario escribe.

**🎥 Vista de detalle de contenido**: muestra poster, backdrop, sinopsis, géneros, rating de TMDb y reseñas de la comunidad.

**✍️ Gestión de reseñas**: permite crear, editar y eliminar la reseña propia de una película o serie.

**👤 Perfil de usuario**: lista las reseñas del usuario autenticado y muestra estadísticas básicas como total y promedio de calificación.

**⚠️ Manejo centralizado de errores**: Axios agrega automáticamente el JWT y redirige al login cuando el backend responde `401`.

---

## 🛠️ Tecnologías Utilizadas

* **Framework Frontend:** React 19
* **Bundler / Dev Server:** Vite 7
* **Lenguaje:** TypeScript
* **Estilos:** Tailwind CSS 4
* **Routing:** React Router DOM 7
* **Cliente HTTP:** Axios
* **Persistencia local:** localStorage

---

## 🔐 Autenticación

La aplicación consume el backend configurado en `VITE_API_BASE_URL`.

Al iniciar sesión o registrarse:

* se guarda el token JWT en `localStorage`
* se guarda el usuario autenticado en `localStorage`
* Axios envía automáticamente el header:

```text
Authorization: Bearer <token>
```

Si la API responde `401`, el frontend limpia la sesión y redirige a `/login`.

---

## 🗂️ Estructura del Proyecto

```text
src/
├── api/
│   ├── authApi.ts                     # Login y registro contra el backend
│   ├── axiosConfig.ts                # Cliente Axios con JWT y manejo de errores
│   ├── reviewApi.ts                  # Operaciones CRUD de reseñas
│   ├── tmdbApi.ts                    # Búsqueda, populares y detalle desde TMDb
│   └── tmdbConfig.ts                 # Cliente Axios configurado para TMDb
├── components/
│   ├── common/
│   │   ├── Layout.tsx                # Layout principal con header y outlet
│   │   ├── Header.tsx                # Navegación principal
│   │   ├── ProtectedRoute.tsx        # Protección de rutas autenticadas
│   │   ├── Loader.tsx                # Indicador de carga
│   │   └── ErrorMessage.tsx          # Mensajes de error reutilizables
│   ├── movies/
│   │   └── MovieCard.tsx             # Tarjeta para películas y series
│   └── reviews/
│       ├── ReviewForm.tsx            # Formulario para crear o editar reseñas
│       ├── ReviewList.tsx            # Listado de reseñas
│       ├── ReviewCard.tsx            # Tarjeta individual de reseña
│       └── RatingDisplay.tsx         # Promedio y total de calificaciones
├── context/
│   └── AuthContext.tsx               # Estado global de autenticación
├── hooks/
│   ├── useAuth.ts                    # Hook para consumir AuthContext
│   └── useDebounce.ts                # Debounce del buscador
├── pages/
│   ├── LoginPage.tsx                 # Pantalla de inicio de sesión
│   ├── RegisterPage.tsx              # Pantalla de registro
│   ├── HomePage.tsx                  # Home con contenido popular
│   ├── SearchPage.tsx                # Búsqueda de películas y series
│   ├── MovieDetailPage.tsx           # Detalle y reseñas de películas/series
│   └── ProfilePage.tsx               # Perfil y reseñas del usuario
├── types/
│   ├── api.ts                        # Tipos de errores y respuestas base
│   ├── auth.ts                       # Tipos de autenticación y usuario
│   ├── movie.ts                      # Tipos de TMDb para películas y series
│   └── review.ts                     # Tipos de reseñas y payloads
├── utils/
│   ├── constants.ts                  # Variables de entorno y endpoints
│   └── localStorage.ts               # Helpers para token y usuario
├── App.tsx                           # Definición de rutas
├── main.tsx                          # Punto de entrada React
└── index.css                         # Tailwind y estilos globales
```

---

## 💡 Flujo General

1. El usuario se registra o inicia sesión desde `/register` o `/login`.
2. El frontend guarda el JWT y los datos del usuario en `localStorage`.
3. Las rutas protegidas validan la sesión antes de renderizar contenido.
4. El home consulta películas y series populares desde TMDb.
5. El buscador permite alternar entre películas y series con consultas con debounce.
6. La vista de detalle combina información de TMDb con las reseñas obtenidas desde la API.
7. El perfil consulta las reseñas propias del usuario autenticado.

---

## 📌 Notas

* El frontend consume TMDb directamente usando la API key configurada en entorno.
* Las rutas `/movie/:id` y `/series/:id` reutilizan la misma página de detalle y determinan el tipo desde la URL.
* La sesión se invalida automáticamente en el cliente cuando el backend responde con `401 Unauthorized`.
* El proyecto está preparado para desarrollo local junto al backend en `http://localhost:8080/api`.
