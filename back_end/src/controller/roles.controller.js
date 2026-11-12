import {
    servicioCrearRoles,
    servicioLeerRoles,
    servicioActualizarRoles,
    servicioEliminarRoles
} from "../services/roles.services.js";

export const crearRoles = async(req,res)=>{

    try{

        const Roles = await servicioCrearRoles(req.body);

        res.status(201).json(Roles);

    }catch(error){

        res.status(400).json({
            mensaje:error.message
        });

    }

}

export const leerRoles = async(req,res)=>{

    try{

        const Roles = await servicioLeerRoles();

        res.status(200).json(Roles);

    }catch(error){

        res.status(400).json({
            mensaje:error.message
        });

    }

}

export const actualizarRoles = async(req,res)=>{

    try{

        const {id} = req.params;

        const Roles = await servicioActualizarRoles(Number(id),req.body);

        res.status(200).json(Roles);

    }catch(error){

        res.status(400).json({
            mensaje:error.message
        });

    }

}

export const eliminarRoles = async(req,res)=>{

    try{

        const {id} = req.params;

        await servicioEliminarRoles(Number(id));

        res.status(200).json({
            mensaje:"Roles eliminado correctamente"
        });

    }catch(error){

        res.status(400).json({
            mensaje:error.message
        });

    }

}
