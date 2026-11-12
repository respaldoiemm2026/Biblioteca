import {
    servicioCrearUsuario,
    servicioLeerUsuario,
    servicioActualizarUsuario,
    servicioEliminarUsuario
} from "../services/usuario.services.js";

export const crearUsuario = async(req,res)=>{

    try{

        const Usuario = await servicioCrearUsuario(req.body);

        const { contrasena, token, ...usuarioSinSensibles } = Usuario;

        res.status(201).json(usuarioSinSensibles);

    }catch(error){

        res.status(400).json({
            mensaje:error.message
        });

    }

}

export const leerUsuario = async(req,res)=>{

    try{

        const Usuario = await servicioLeerUsuario();

        const usuariosSinSensibles = Usuario.map(({contrasena, token, ...resto}) => resto);

        res.status(200).json(usuariosSinSensibles);

    }catch(error){

        res.status(400).json({
            mensaje:error.message
        });

    }

}

export const actualizarUsuario = async(req,res)=>{

    try{

        const {id} = req.params;

        const Usuario = await servicioActualizarUsuario(Number(id),req.body);

        const { contrasena, token, ...usuarioSinSensibles } = Usuario;

        res.status(200).json(usuarioSinSensibles);

    }catch(error){

        res.status(400).json({
            mensaje:error.message
        });

    }

}

export const eliminarUsuario = async(req,res)=>{

    try{

        const {id} = req.params;

        await servicioEliminarUsuario(Number(id));

        res.status(200).json({
            mensaje:"Usuario eliminado correctamente"
        });

    }catch(error){

        res.status(400).json({
            mensaje:error.message
        });

    }

}
