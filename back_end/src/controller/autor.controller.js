import {
    servicioCrearAutor,
    servicioLeerAutor,
    servicioActualizarAutor,
    servicioEliminarAutor
} from "../services/autor.services.js";

export const crearAutor = async(req,res)=>{

    try{

        const Autor = await servicioCrearAutor(req.body);

        res.status(201).json(Autor);

    }catch(error){

        res.status(400).json({
            mensaje:error.message
        });

    }

};

export const leerAutor = async(req,res)=>{

    try{

        const Autor = await servicioLeerAutor();

        res.status(200).json(Autor);

    }catch(error){

        res.status(400).json({
            mensaje:error.message
        });

    }

};

export const actualizarAutor = async(req,res)=>{

    try{

        const {id} = req.params;

        const Autor = await servicioActualizarAutor(Number(id),req.body);

        res.status(200).json(Autor);

    }catch(error){

        res.status(400).json({
            mensaje:error.message
        });

    }

};

export const eliminarAutor = async(req,res)=>{

    try{

        const {id} = req.params;

        await servicioEliminarAutor(Number(id));

        res.status(200).json({
            mensaje:"Autor eliminado correctamente"
        });

    }catch(error){

        res.status(400).json({
            mensaje:error.message
        });

    }

};
