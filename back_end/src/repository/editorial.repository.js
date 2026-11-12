import prisma from "../prisma.js"

export const crearEditorial = (EditorialData)=> {
    return prisma.editorial.create({data: EditorialData});
}

export const leerEditorial = ()=> {
    return prisma.editorial.findMany();
}

export const actualizarEditorial = (EditorialId, EditorialData)=> {
    return prisma.editorial.update({
        where: {id: EditorialId},
        data: EditorialData
    });
}

export const eliminarEditorial = (EditorialId)=> {
    return prisma.editorial.delete({
        where: {id: EditorialId}
    });
}
