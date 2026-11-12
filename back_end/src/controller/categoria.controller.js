import {
    servicioCrearCategoria,
    servicioLeerCategoria,
    servicioActualizarCategoria,
    servicioEliminarCategoria
} from "../services/categoria.services.js";

export const crearCategoria = async(req,res)=>{

    try{

        const Categoria = await servicioCrearCategoria(req.body);

        res.status(201).json(Categoria);

    }catch(error){

        res.status(400).json({
            mensaje:error.message
        });

    }

}

export const leerCategoria = async(req,res)=>{

    try{

        const Categoria = await servicioLeerCategoria();

        res.status(200).json(Categoria);

    }catch(error){

        res.status(400).json({
            mensaje:error.message
        });

    }

}

export const actualizarCategoria = async(req,res)=>{

    try{

        const {id} = req.params;

        const Categoria = await servicioActualizarCategoria(Number(id),req.body);

        res.status(200).json(Categoria);

    }catch(error){

        res.status(400).json({
            mensaje:error.message
        });

    }

}

export const eliminarCategoria = async(req,res)=>{

    try{

        const {id} = req.params;

        await servicioEliminarCategoria(Number(id));

        res.status(200).json({
            mensaje:"Categoria eliminado correctamente"
        });

    }catch(error){

        res.status(400).json({
            mensaje:error.message
        });

    }

}
