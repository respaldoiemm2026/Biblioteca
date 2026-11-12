import { leerLibroCategoria } from "../repository/libroCategoria.repository.js";
import { crearLibroCategoria } from "../repository/libroCategoria.repository.js";
import { actualizarLibroCategoria } from "../repository/libroCategoria.repository.js";
import { eliminarLibroCategoria } from "../repository/libroCategoria.repository.js";

export const servicioCrearLibroCategoria = (LibroCategoriaData) => {
    return crearLibroCategoria(LibroCategoriaData);
}

export const servicioLeerLibroCategoria = () => {
    return leerLibroCategoria();
}

export const servicioActualizarLibroCategoria = (idLibro, idCategoria, LibroCategoriaData) => {
    return actualizarLibroCategoria(idLibro, idCategoria, LibroCategoriaData);
}

export const servicioEliminarLibroCategoria = (idLibro, idCategoria) => {
    return eliminarLibroCategoria(idLibro, idCategoria);
}
