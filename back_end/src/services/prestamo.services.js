import { leerPrestamo } from "../repository/prestamo.repository.js";
import { crearPrestamo } from "../repository/prestamo.repository.js";
import { actualizarPrestamo } from "../repository/prestamo.repository.js";
import { eliminarPrestamo } from "../repository/prestamo.repository.js";

export const servicioCrearPrestamo = (PrestamoData) => {
    return crearPrestamo(PrestamoData);
}

export const servicioLeerPrestamo = () => {
    return leerPrestamo();
};

export const servicioActualizarPrestamo = (PrestamoId, PrestamoData) => {
    return actualizarPrestamo(PrestamoId, PrestamoData);
}

export const servicioEliminarPrestamo = (PrestamoId) => {
    return eliminarPrestamo(PrestamoId);
}

