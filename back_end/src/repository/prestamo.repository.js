import prisma from "../prisma.js"

export const crearPrestamo = (PrestamoData)=> {
    return prisma.prestamo.create({data: PrestamoData});
}

export const leerPrestamo = ()=> {
    return prisma.prestamo.findMany({
        include: {
            detallesPrestamo: {
                include: {
                    libro: true,
                    // Solo datos públicos del usuario (sin contraseña ni token)
                    usuario: {
                        select: { id: true, nombre: true, correo: true, curso: true }
                    }
                }
            }
        },
        orderBy: { id: "desc" }
    });
}

export const actualizarPrestamo = (PrestamoId, PrestamoData)=> {
    return prisma.prestamo.update({
        where: {id: PrestamoId},
        data: PrestamoData
    });
}

export const eliminarPrestamo = (PrestamoId)=> {
    return prisma.prestamo.delete({
        where: {id: PrestamoId}
    });
}
