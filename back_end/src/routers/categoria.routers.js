import { Router } from "express";

import {
    crearCategoria,
    leerCategoria,
    actualizarCategoria,
    eliminarCategoria
} from "../controller/categoria.controller.js";
import { requiereRol } from "../middlewares/auth.middleware.js";
const router = Router();
const soloAdmin = requiereRol("admin");

router.post("/", soloAdmin, crearCategoria);

router.get("/", leerCategoria);

router.put("/:id", soloAdmin, actualizarCategoria);

router.delete("/:id", soloAdmin, eliminarCategoria);

export default router;

