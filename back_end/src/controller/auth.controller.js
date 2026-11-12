import { servicioLogin, servicioLogout, servicioRegistro } from "../services/auth.services.js";
import { buscarUsuarioPorId } from "../repository/usuario.repository.js";

// En producción la cookie solo viaja por HTTPS.
// sameSite "lax" funciona porque el frontend usa el proxy /api de Vercel
// (mismo dominio). Si algún día se llama al backend directamente desde otro
// dominio, define COOKIE_SAMESITE="none".
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.COOKIE_SAMESITE || "lax",
    maxAge: 1000 * 60 * 60 * 24 // 1 día
};

export const registrar = async (req, res) => {
    try {
        const { nombre, correo, contrasena, curso } = req.body; 

        // Se usa el nombre correcto exportado por el servicio: servicioRegistro
        const nuevoUsuario = await servicioRegistro({
            nombre,
            correo,
            contrasena,
            curso
        });

        res.status(201).json(nuevoUsuario);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
};

export const me = async (req, res) => {
    try {
        const usuario = await buscarUsuarioPorId(req.usuario.id);
        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        const { contrasena, token, ...usuarioSeguro } = usuario;
        res.status(200).json({ usuario: usuarioSeguro });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;
        const resultado = await servicioLogin(correo, contrasena);

        res.cookie("token", resultado.token, COOKIE_OPTIONS);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(401).json({ mensaje: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        await servicioLogout(req.usuario.id);
        res.clearCookie("token", COOKIE_OPTIONS);

        res.status(200).json({ mensaje: "Sesion cerrada correctamente" });
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
};