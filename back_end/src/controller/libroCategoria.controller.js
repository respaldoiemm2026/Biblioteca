import {
    servicioCrearLibroCategoria,
    servicioLeerLibroCategoria,
    servicioActualizarLibroCategoria,
    servicioEliminarLibroCategoria
} from "../services/libroCategoria.services.js";

export const crearLibroCategoria = async(req,res)=>{

    try{

        const LibroCategoria = await servicioCrearLibroCategoria(req.body);

        res.status(201).json(LibroCategoria);

    }catch(error){

        res.status(400).json({
            mensaje:error.message
        });

    }

}

export const leerLibroCategoria = async(req,res)=>{

    try{

        const LibroCategoria = await servicioLeerLibroCategoria();

        res.status(200).json(LibroCategoria);

    }catch(error){

        res.status(400).json({
            mensaje:error.message
        });

    }

}

export const actualizarLibroCategoria = async(req,res)=>{

    try{

        const {idLibro, idCategoria} = req.params;

        const LibroCategoria = await servicioActualizarLibroCategoria(Number(idLibro), Number(idCategoria), req.body);

        res.status(200).json(LibroCategoria);

    }catch(error){

        res.status(400).json({
            mensaje:error.message
        });

    }

}

export const eliminarLibroCategoria = async(req,res)=>{

    try{

        const {idLibro, idCategoria} = req.params;

        await servicioEliminarLibroCategoria(Number(idLibro), Number(idCategoria));

        res.status(200).json({
            mensaje:"LibroCategoria eliminado correctamente"
        });

    }catch(error){

        res.status(400).json({
            mensaje:error.message
        });

    }

}

