import prisma from "../prisma.js"

export const crearCategoria = (CategoriaData)=> {
    return prisma.categoria.create({data: CategoriaData});
}

export const leerCategoria = ()=> {
    return prisma.categoria.findMany();
}

export const actualizarCategoria = (CategoriaId, CategoriaData)=> {
    return prisma.categoria.update({
        where: {id: CategoriaId},
        data: CategoriaData
    });
}

export const eliminarCategoria = (CategoriaId)=> {
    return prisma.categoria.delete({
        where: {id: CategoriaId}
    });
}
