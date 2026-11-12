import { Router } from "express";

import {
    crearPrestamo,
    leerPrestamo,
    actualizarPrestamo,
    eliminarPrestamo
} from "../controller/prestamo.controller.js";
import { requiereRol } from "../middlewares/auth.middleware.js";

const router = Router();
const soloAdmin = requiereRol("admin");

router.post("/", crearPrestamo);

router.get("/", soloAdmin, leerPrestamo);

router.put("/:id", soloAdmin, actualizarPrestamo);

router.delete("/:id", soloAdmin, eliminarPrestamo);

export default router;

