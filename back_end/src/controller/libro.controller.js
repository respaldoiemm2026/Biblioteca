import {
    servicioCrearLibro,
    servicioLeerLibros,
    servicioLeerLibroPorId,
    servicioActualizarLibro,
    servicioEliminarLibro
} from "../services/libro.services.js";

export const crearLibro = async(req,res)=>{
    try{
        const Libro = await servicioCrearLibro(req.body);
        res.status(201).json(Libro);
    }catch(error){
        res.status(400).json({ mensaje:error.message });
    }
}

export const leerLibro = async (req, res) => {
    try {
        const libros = await servicioLeerLibros();
        res.status(200).json(libros);
    } catch (error) {
        console.error("Error al leer libros:", error);
        res.status(400).json({ mensaje: error.message });
    }
};

export const leerLibroPorId = async(req,res)=>{
    try{
        const {id} = req.params;
        const Libro = await servicioLeerLibroPorId(Number(id));
        if(!Libro) return res.status(404).json({ mensaje: "Libro no encontrado" });
        res.status(200).json(Libro);
    }catch(error){
        res.status(400).json({ mensaje:error.message });
    }
}

export const actualizarLibro = async(req,res)=>{
    try{
        const {id} = req.params;
        const Libro = await servicioActualizarLibro(Number(id),req.body);
        res.status(200).json(Libro);
    }catch(error){
        res.status(400).json({ mensaje:error.message });
    }
}

export const eliminarLibro = async(req,res)=>{
    try{
        const {id} = req.params;
        await servicioEliminarLibro(Number(id));
        res.status(200).json({ mensaje:"Libro eliminado correctamente" });
    }catch(error){
        res.status(400).json({ mensaje:error.message });
    }
}