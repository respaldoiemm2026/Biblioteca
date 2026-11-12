import { Router } from "express";

import {
    crearLibro,
    leerLibro,
    leerLibroPorId, // Importamos la nueva función
    actualizarLibro,
    eliminarLibro
} from "../controller/libro.controller.js";
import { requiereRol } from "../middlewares/auth.middleware.js";

const router = Router();
const soloAdmin = requiereRol("admin");

router.post("/", soloAdmin, crearLibro);

router.get("/", leerLibro);

// NUEVA RUTA AÑADIDA
router.get("/:id", leerLibroPorId);

router.put("/:id", soloAdmin, actualizarLibro);

router.delete("/:id", soloAdmin, eliminarLibro);

export default router;