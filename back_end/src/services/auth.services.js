import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { buscarUsuarioPorCorreo, crearUsuario, guardarToken } from "../repository/usuario.repository.js";
import { buscarRolPorNombre } from "../repository/roles.repository.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";
const SALT_ROUNDS = 10;
const ROL_POR_DEFECTO = "usuario";

export const servicioRegistro = async ({ nombre, correo, contrasena, curso }) => {

    if (!nombre || !correo || !contrasena) {
        throw new Error("Nombre, correo y contraseña son obligatorios");
    }

    const correoLimpio = correo.toLowerCase().trim();

    const usuarioExistente = await buscarUsuarioPorCorreo(correoLimpio);

    if (usuarioExistente) {
        throw new Error("Ya existe un usuario registrado con ese correo");
    }

    const rol = await buscarRolPorNombre(ROL_POR_DEFECTO);

    if (!rol) {
        throw new Error(`No existe el rol por defecto "${ROL_POR_DEFECTO}", ejecuta el seed de roles`);
    }

    const contrasenaHasheada = await bcrypt.hash(contrasena.trim(), SALT_ROUNDS);

    const usuario = await crearUsuario({
        nombre: nombre.trim(),
        correo: correoLimpio,
        contrasena: contrasenaHasheada,
        curso: curso ? curso.trim() : null, // Se añade la propiedad curso para guardarla en la BD
        idRol: rol.id
    });

    const { contrasena: _contrasena, token: _token, ...usuarioSeguro } = usuario;

    return usuarioSeguro;

};

export const servicioLogin = async (correo, contrasena) => {

    if (!correo || !contrasena) {
        throw new Error("Correo y contraseña son obligatorios");
    }

    const correoLimpio = correo.toLowerCase().trim();

    const usuario = await buscarUsuarioPorCorreo(correoLimpio);

    if (!usuario || !usuario.contrasena) {
        throw new Error("Credenciales invalidas");
    }

    const contrasenaValida = await bcrypt.compare(contrasena.trim(), usuario.contrasena);

    if (!contrasenaValida) {
        throw new Error("Credenciales invalidas");
    }

    const token = jwt.sign(
        { id: usuario.id, correo: usuario.correo, idRol: usuario.idRol },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );

    await guardarToken(usuario.id, token);

    return {
        token,
        usuario: {
            id: usuario.id,
            nombre: usuario.nombre,
            correo: usuario.correo,
            idRol: usuario.idRol
        }
    };

};

export const servicioLogout = async (usuarioId) => {
    await guardarToken(usuarioId, null);
};