import { Router } from "express";

import {
    crearEditorial,
    leerEditorial,
    actualizarEditorial,
    eliminarEditorial
} from "../controller/editorial.controller.js";
import { requiereRol } from "../middlewares/auth.middleware.js";

const router = Router();
const soloAdmin = requiereRol("admin");

router.post("/", soloAdmin, crearEditorial);

router.get("/", leerEditorial);

router.put("/:id", soloAdmin, actualizarEditorial);

router.delete("/:id", soloAdmin, eliminarEditorial);

export default router;

