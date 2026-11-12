// URL base de la API.
// - En local (Live Server) se llama directo al backend en el puerto 3000.
// - En Vercel se usa "/api", que vercel.json reenvía al backend de Render.
//   Así la cookie de sesión queda en el mismo dominio que el frontend.
const API_URL = ["localhost", "127.0.0.1"].includes(window.location.hostname)
    ? "http://localhost:3000"
    : "/api";
