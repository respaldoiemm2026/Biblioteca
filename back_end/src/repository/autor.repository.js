import prisma from "../prisma.js"

export const crearAutor = (AutorData)=> {
    return prisma.autor.create({data: AutorData});
}

export const leerAutor = ()=> {
    return prisma.autor.findMany();
}

export const actualizarAutor = (AutorId, AutorData)=> {
    return prisma.autor.update({
        where: {id: AutorId},
        data: AutorData
    });
}

export const eliminarAutor = (AutorId)=> {
    return prisma.autor.delete({
        where: {id:AutorId}
    });
}
