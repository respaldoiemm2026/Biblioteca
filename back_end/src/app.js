import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import auth from "./routers/auth.routers.js";
import usuario from "./routers/usuario.routers.js";
import autor from "./routers/autor.routers.js";
import categoria from "./routers/categoria.routers.js";
import detallePrestamo from "./routers/detallePrestamo.routers.js";
import editorial from "./routers/editorial.routers.js";
import libro from "./routers/libro.routers.js";
import libroCategoria from "./routers/libroCategoria.routers.js";
import prestamo from "./routers/prestamo.routers.js";
import roles from "./routers/roles.routers.js";
import { verificarToken, requiereRol } from "./middlewares/auth.middleware.js";

const app = express();

// Render (y el proxy de Vercel) ponen el servidor detrás de un proxy
app.set("trust proxy", 1);

// Orígenes permitidos: variable FRONTEND_URL (separados por coma).
// En producción el frontend llama vía el proxy /api de Vercel (mismo origen),
// pero se deja CORS configurado por si se llama al backend directamente.
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5500,http://127.0.0.1:5500")
  .split(",")
  .map((origen) => origen.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser()); // cookieParser debe estar antes de definir cualquier ruta

// Health check para Render
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Rutas públicas de autenticación (registro/login no requieren sesion)
app.use("/auth", auth);

// Rutas protegidas: todas requieren sesion iniciada (verificarToken).
// - usuario y roles: solo admin.
// - libro, categoria, autor, editorial: lectura (GET) para cualquier usuario
//   con sesion; crear/editar/borrar solo admin (ver cada router).
// - prestamo y detallePrestamo: cualquier usuario puede crear (solicitar un
//   prestamo); listar/editar/borrar solo admin.
app.use("/usuario", verificarToken, requiereRol("admin"), usuario);
app.use("/autor", verificarToken, autor);
app.use("/categoria", verificarToken, categoria);
app.use("/detallePrestamo", verificarToken, detallePrestamo);
app.use("/editorial", verificarToken, editorial);
app.use("/libro", verificarToken, libro);
app.use("/libroCategoria", verificarToken, requiereRol("admin"), libroCategoria);
app.use("/prestamo", verificarToken, prestamo);
app.use("/roles", verificarToken, requiereRol("admin"), roles);

export default app;
