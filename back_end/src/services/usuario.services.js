import bcrypt from "bcryptjs";
import { leerUsuario } from "../repository/usuario.repository.js";
import { crearUsuario } from "../repository/usuario.repository.js";
import { actualizarUsuario } from "../repository/usuario.repository.js";
import { eliminarUsuario } from "../repository/usuario.repository.js";

const SALT_ROUNDS = 10;

export const servicioCrearUsuario = async (UsuarioData) => {

    if (UsuarioData.contrasena) {
        UsuarioData.contrasena = await bcrypt.hash(UsuarioData.contrasena, SALT_ROUNDS);
    }

    return crearUsuario(UsuarioData);
}

export const servicioLeerUsuario = async() => {
    return  await leerUsuario();
}

export const servicioActualizarUsuario = async (UsuarioId, UsuarioData) => {

    if (UsuarioData.contrasena) {
        UsuarioData.contrasena = await bcrypt.hash(UsuarioData.contrasena, SALT_ROUNDS);
    }

    return actualizarUsuario(UsuarioId, UsuarioData);
}

export const servicioEliminarUsuario = (UsuarioId) => {
    return eliminarUsuario(UsuarioId);
}
