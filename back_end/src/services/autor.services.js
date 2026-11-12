import { leerAutor } from "../repository/autor.repository.js";
import { crearAutor } from "../repository/autor.repository.js";
import { actualizarAutor } from "../repository/autor.repository.js";
import { eliminarAutor } from "../repository/autor.repository.js";

export const servicioCrearAutor = (autorData) => {
    return crearAutor(autorData);
}

export const servicioLeerAutor = () => {
    return leerAutor();
}

export const servicioActualizarAutor = (AutorId, AutorData) => {
    return actualizarAutor(AutorId, AutorData);
}

export const servicioEliminarAutor = (AutorId) => {
    return eliminarAutor(AutorId);
}
