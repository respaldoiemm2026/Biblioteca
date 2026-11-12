import prisma from "../prisma.js"

export const crearLibroCategoria = (LibroCategoriaData)=> {
    return prisma.libroCategoria.create({data: LibroCategoriaData});
}

export const leerLibroCategoria = ()=> {
    return prisma.libroCategoria.findMany();
}

export const actualizarLibroCategoria = (idLibro, idCategoria, LibroCategoriaData)=> {
    return prisma.libroCategoria.update({
        where: {idLibro_idCategoria: {idLibro, idCategoria}},
        data: LibroCategoriaData
    });
}

export const eliminarLibroCategoria = (idLibro, idCategoria)=> {
    return prisma.libroCategoria.delete({
        where: {idLibro_idCategoria: {idLibro, idCategoria}}
    });
}
