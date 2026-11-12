import { 
    crearLibro, 
    leerLibro, 
    actualizarLibro, 
    eliminarLibro,
    leerLibroPorId 
} from "../repository/libro.repository.js";

export const servicioCrearLibro = (LibroData) => {
    const { idAutor, idEditorial, ...restoDatos } = LibroData;

    const datosFormateados = {
        ...restoDatos,
        autor: idAutor ? { connect: { id: Number(idAutor) } } : undefined,
        editorial: idEditorial ? { connect: { id: Number(idEditorial) } } : undefined
    };

    return crearLibro(datosFormateados);
};

export const servicioLeerLibros = () => {
    return leerLibro();
};

export const servicioActualizarLibro = (LibroId, LibroData) => {
    return actualizarLibro(LibroId, LibroData);
};

export const servicioEliminarLibro = (LibroId) => {
    return eliminarLibro(LibroId);
};

// NUEVA FUNCIÓN EXPORTADA EN EL SERVICIO
export const servicioLeerLibroPorId = (idLibro) => {
    return leerLibroPorId(idLibro);
};