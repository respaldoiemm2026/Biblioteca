import prisma from "../prisma.js";

export const crearLibro = (LibroData) => {
    return prisma.libro.create({ data: LibroData });
};

export const leerLibro = async () => {
    const libros = await prisma.libro.findMany({
        include: {
            autor: true,
            editorial: true,
            detallesPrestamo: {
                include: {
                    prestamo: true
                }
            }
        }
    }); 

    return libros.map(libro => {
        const prestamoActivo = libro.detallesPrestamo.find(detalle => 
            detalle.prestamo && ["Pendiente", "Aprobado"].includes(detalle.prestamo.estado)
        );

        return {
            ...libro,
            estadoDisponibilidad: prestamoActivo ? prestamoActivo.prestamo.estado : "Disponible"
        };
    });
};

export const actualizarLibro = (LibroId, LibroData) => {
    return prisma.libro.update({
        where: { id: LibroId },
        data: LibroData
    });
};

export const eliminarLibro = (LibroId) => {
    return prisma.libro.delete({
        where: { id: LibroId }
    });
};

// NUEVA FUNCIÓN AÑADIDA AL REPOSITORIO
export const leerLibroPorId = async (idLibro) => {
    return await prisma.libro.findUnique({
        where: { id: Number(idLibro) },
        include: {
            autor: true,
            editorial: true
        }
    });
};