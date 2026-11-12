import { Router } from "express";
import {
    crearDetallePrestamo,
    leerDetallePrestamo,
    actualizarDetallePrestamo, // <--- Asegúrate de importarla
    eliminarDetallePrestamo
} from "../controller/detallePrestamo.controller.js";
import { requiereRol } from "../middlewares/auth.middleware.js";

const router = Router();
const soloAdmin = requiereRol("admin");

router.post("/", crearDetallePrestamo);
router.get("/", soloAdmin, leerDetallePrestamo);
router.put("/:id", soloAdmin, actualizarDetallePrestamo); // <--- Asegúrate de tener esta línea
router.delete("/:id", soloAdmin, eliminarDetallePrestamo);

export default router;  