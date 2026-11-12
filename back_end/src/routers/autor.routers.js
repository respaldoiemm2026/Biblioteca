import { Router } from "express";

import {
    crearAutor,
    leerAutor,
    actualizarAutor,
    eliminarAutor
} from "../controller/autor.controller.js";
import { requiereRol } from "../middlewares/auth.middleware.js";

const router = Router();
const soloAdmin = requiereRol("admin");

router.post("/", soloAdmin, crearAutor);

router.get("/", leerAutor);

router.put("/:id", soloAdmin, actualizarAutor);

router.delete("/:id", soloAdmin, eliminarAutor);

export default router;

