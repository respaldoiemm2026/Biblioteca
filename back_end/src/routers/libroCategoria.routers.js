import { Router } from "express";

import {
    crearLibroCategoria,
    leerLibroCategoria,
    actualizarLibroCategoria,
    eliminarLibroCategoria
} from "../controller/libroCategoria.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verificarToken, crearLibroCategoria);

router.get("/", verificarToken, leerLibroCategoria);

router.put("/:idLibro/:idCategoria", verificarToken, actualizarLibroCategoria);

router.delete("/:idLibro/:idCategoria", verificarToken, eliminarLibroCategoria);

export default router;

