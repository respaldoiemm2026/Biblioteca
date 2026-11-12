import { Router } from "express";
import { login, logout, registrar, me } from "../controller/auth.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js"; 

const router = Router();

router.post("/registro", registrar);
router.post("/login", login);
router.post("/logout", verificarToken, logout);
router.get("/me", verificarToken, me);

export default router;