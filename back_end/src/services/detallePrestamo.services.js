import { 
    leerDetallePrestamo, 
    crearDetallePrestamo, 
    actualizarDetallePrestamo, 
    eliminarDetallePrestamo 
} from "../repository/detallePrestamo.repository.js";
import prisma from "../prisma.js";

export const servicioCrearDetallePrestamo = async (DetallePrestamoData, { validarSolicitud = false } = {}) => {

    if (validarSolicitud) {
        const prestamo = await prisma.prestamo.findUnique({
            where: { id: DetallePrestamoData.idPrestamo },
            include: { detallesPrestamo: true }
        });

        if (!prestamo || prestamo.estado !== "Pendiente" || prestamo.detallesPrestamo.length > 0) {
            throw new Error("Préstamo no válido para esta solicitud");
        }

        const libro = await prisma.libro.findUnique({
            where: { id: DetallePrestamoData.idLibro },
            include: { detallesPrestamo: { include: { prestamo: true } } }
        });

        if (!libro) {
            throw new Error("El libro no existe");
        }

        const ocupado = libro.detallesPrestamo.some(d =>
            d.prestamo && ["Pendiente", "Aprobado"].includes(d.prestamo.estado)
        );

        if (ocupado) {
            throw new Error("El libro ya tiene un préstamo pendiente o activo");
        }
    }

    return crearDetallePrestamo(DetallePrestamoData);
}

export const servicioLeerDetallePrestamo = () => {
    return leerDetallePrestamo();
}

export const servicioActualizarDetallePrestamo = (DetallePrestamoId, DetallePrestamoData) => {
    return actualizarDetallePrestamo(DetallePrestamoId, DetallePrestamoData);
}

export const servicioEliminarDetallePrestamo = (DetallePrestamoId) => {
    return eliminarDetallePrestamo(DetallePrestamoId);
}