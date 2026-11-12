import jwt from "jsonwebtoken";
import prisma from "../prisma.js";

export const verificarToken = async (req, res, next) => {

    try {

        let token = req.cookies?.token;

        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1];
            }
        }

        if (!token) {
            return res.status(401).json({
                mensaje: "Token no proporcionado"
            });
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET);

        const usuario = await prisma.usuario.findUnique({
            where: { id: payload.id },
            include: { rol: true }
        });

        // El token debe coincidir con el almacenado en la base de datos,
        // asi al hacer logout (o cambiar la sesion) el token queda invalidado.
        if (!usuario || !usuario.token || usuario.token !== token) {
            return res.status(401).json({
                mensaje: "Sesion invalida o expirada, inicia sesion nuevamente"
            });
        }

        req.usuario = {
            id: usuario.id,
            correo: usuario.correo,
            idRol: usuario.idRol,
            rol: usuario.rol?.rol ?? null
        };

        next();

    } catch (error) {

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                mensaje: "El token ha expirado, inicia sesion nuevamente"
            });
        }

        return res.status(401).json({
            mensaje: "Token invalido"
        });

    }

}

// Middleware de autorizacion: se usa despues de verificarToken.
// Ejemplo: requiereRol("admin") o requiereRol("admin", "bibliotecario")
export const requiereRol = (...rolesPermitidos) => {

    return (req, res, next) => {

        if (!req.usuario) {
            return res.status(401).json({
                mensaje: "Token no proporcionado"
            });
        }

        if (!rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({
                mensaje: "No tienes permisos para realizar esta accion"
            });
        }

        next();

    }

}
