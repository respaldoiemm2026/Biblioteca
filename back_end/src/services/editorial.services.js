import {
    crearEditorial,
    leerEditorial,
    actualizarEditorial,
    eliminarEditorial
} from "../repository/editorial.repository.js";

export const servicioCrearEditorial = (datos) => {
    return crearEditorial(datos);
};

export const servicioLeerEditorial = () => {
    return leerEditorial();
};

export const servicioActualizarEditorial = (id, datos) => {
    return actualizarEditorial(id, datos);
};

export const servicioEliminarEditorial = (id) => {
    return eliminarEditorial(id);
};