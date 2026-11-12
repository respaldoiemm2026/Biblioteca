import {
    servicioCrearPrestamo,
    servicioLeerPrestamo,
    servicioActualizarPrestamo,
    servicioEliminarPrestamo
} from "../services/prestamo.services.js";

export const crearPrestamo = async(req,res)=>{

    try{

        // Un usuario que no es admin solo puede solicitar un préstamo:
        // siempre queda "Pendiente" y no puede elegir el estado.
        const datos = req.usuario.rol === "admin"
            ? req.body
            : {
                fechaPrestamo: req.body.fechaPrestamo,
                fechaRegreso: req.body.fechaRegreso,
                estado: "Pendiente"
            };

        const Prestamo = await servicioCrearPrestamo(datos);

        res.status(201).json(Prestamo);

    }catch(error){

        res.status(400).json({
            mensaje:error.message
        });

    }

}

export const leerPrestamo = async(req,res)=>{

    try{

        const Prestamo = await servicioLeerPrestamo();

        res.status(200).json(Prestamo);

    }catch(error){

        res.status(400).json({
            mensaje:error.message
        });

    }

}

export const actualizarPrestamo = async(req,res)=>{

    try{

        const {id} = req.params;

        const Prestamo = await servicioActualizarPrestamo(Number(id),req.body);

        res.status(200).json(Prestamo);

    }catch(error){

        res.status(400).json({
            mensaje:error.message
        });

    }

}

export const eliminarPrestamo = async(req,res)=>{

    try{

        const {id} = req.params;

        await servicioEliminarPrestamo(Number(id));

        res.status(200).json({
            mensaje:"Prestamo eliminado correctamente"
        });

    }catch(error){

        res.status(400).json({
            mensaje:error.message
        });

    }

}

