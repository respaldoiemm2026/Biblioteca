import  prisma  from "../prisma.js";

export const crearDetallePrestamo = async (detalleData) => {
    const { idUsuario, idPrestamo, idLibro } = detalleData;

    // VALIDACIÓN: Evitar que soliciten un libro con préstamo Pendiente o Aprobado activo
    const prestamoExistente = await prisma.detallePrestamo.findFirst({
        where: {
            idLibro: Number(idLibro),
            prestamo: {
                estado: {
                    in: ["Pendiente", "Aprobado"]
                }
            }
        }
    });

    if (prestamoExistente) {
        throw new Error("Este libro ya se encuentra solicitado o en préstamo activo y no puede ser seleccionado.");
    }

    // Si está disponible, creamos el detalle
    return await prisma.detallePrestamo.create({
        data: {
            idUsuario: Number(idUsuario),
            idPrestamo: Number(idPrestamo),
            idLibro: Number(idLibro)
        }
    });
};

export const leerDetallePrestamo = async () => {
    // Incluimos las relaciones para que el panel administrativo reciba el usuario, libro y el estado
    return await prisma.detallePrestamo.findMany({
        include: {
            // Solo datos públicos del usuario (sin contraseña ni token)
            usuario: {
                select: { id: true, nombre: true, correo: true, curso: true }
            },
            libro: true,     
            prestamo: true   
        }
    });
};

export const actualizarDetallePrestamo = async (idDetalle, detalleData) => {
    const { estado } = detalleData;

    const detalle = await prisma.detallePrestamo.findUnique({
        where: { id: Number(idDetalle) }
    });

    if (!detalle) {
        throw new Error("Registro de préstamo no encontrado");
    }

    // Si mandan a actualizar el estado, modificamos la tabla Prestamo directamente
    if (estado) {
        return await prisma.prestamo.update({
            where: { id: detalle.idPrestamo },
            data: { estado }
        });
    }

    return await prisma.detallePrestamo.update({
        where: { id: Number(idDetalle) },
        data: detalleData
    });
};

export const eliminarDetallePrestamo = async (idDetalle) => {
    return await prisma.detallePrestamo.delete({
        where: { id: Number(idDetalle) }
    });
};