import { Router } from "express";
import {
    crearUsuario,
    leerUsuario,
    actualizarUsuario,
    eliminarUsuario
} from "../controller/usuario.controller.js";

const router = Router();

// La autenticación (verificarToken) y autorización (requiereRol) 
// se aplican globalmente en app.js al montar este router.

router.post("/", crearUsuario);
router.get("/", leerUsuario);
router.put("/:id", actualizarUsuario);
router.delete("/:id", eliminarUsuario);

export default router;