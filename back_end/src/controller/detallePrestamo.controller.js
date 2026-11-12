import {
    servicioCrearDetallePrestamo,
    servicioLeerDetallePrestamo,
    servicioActualizarDetallePrestamo,
    servicioEliminarDetallePrestamo
} from "../services/detallePrestamo.services.js";

export const crearDetallePrestamo = async (req, res) => {
    try {
        const esAdmin = req.usuario.rol === "admin";

        // Un usuario que no es admin solo puede crear detalles a su nombre
        // y sobre un préstamo propio recién creado (pendiente y sin detalles).
        const datos = esAdmin
            ? req.body
            : {
                idUsuario: req.usuario.id,
                idPrestamo: Number(req.body.idPrestamo),
                idLibro: Number(req.body.idLibro)
            };

        const nuevoDetalle = await servicioCrearDetallePrestamo(datos, { validarSolicitud: !esAdmin });
        res.status(201).json(nuevoDetalle);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
}

export const leerDetallePrestamo = async (req, res) => {
    try {
        const detalles = await servicioLeerDetallePrestamo();
        res.status(200).json(detalles);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
}

export const actualizarDetallePrestamo = async (req, res) => {
    try {
        const { id } = req.params;
        const prestamoActualizado = await servicioActualizarDetallePrestamo(id, req.body);
        
        res.status(200).json({ 
            mensaje: "Estado del préstamo actualizado con éxito", 
            prestamo: prestamoActualizado 
        });
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
}

export const eliminarDetallePrestamo = async (req, res) => {
    try {
        const { id } = req.params;
        await servicioEliminarDetallePrestamo(id);
        
        res.status(200).json({ mensaje: "Detalle de préstamo eliminado correctamente" });
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
}