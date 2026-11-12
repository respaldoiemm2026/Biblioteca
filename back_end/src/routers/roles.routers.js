import { Router } from "express";

import {
    crearRoles,
    leerRoles,
    actualizarRoles,
    eliminarRoles
} from "../controller/roles.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verificarToken, crearRoles);

router.get("/", verificarToken, leerRoles);

router.put("/:id", verificarToken, actualizarRoles);

router.delete("/:id", verificarToken, eliminarRoles);

export default router;

