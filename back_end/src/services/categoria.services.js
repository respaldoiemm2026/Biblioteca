import { leerCategoria } from "../repository/categoria.repository.js";
import { crearCategoria } from "../repository/categoria.repository.js";
import { actualizarCategoria } from "../repository/categoria.repository.js";
import { eliminarCategoria } from "../repository/categoria.repository.js";

export const servicioCrearCategoria = (CategoriaData) => {
    return crearCategoria(CategoriaData);
}

export const servicioLeerCategoria = () => {
    return leerCategoria();
}

export const servicioActualizarCategoria = (CategoriaId, CategoriaData) => {
    return actualizarCategoria(CategoriaId, CategoriaData);
}

export const servicioEliminarCategoria = (CategoriaId) => {
    return eliminarCategoria(CategoriaId);
}