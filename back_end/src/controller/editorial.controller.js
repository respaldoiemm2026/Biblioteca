import {
    servicioCrearEditorial,
    servicioLeerEditorial,
    servicioActualizarEditorial,
    servicioEliminarEditorial
} from "../services/editorial.services.js";

export const crearEditorial = async (req, res) => {
    try {
        const editorial = await servicioCrearEditorial(req.body);
        res.status(201).json(editorial);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
};

export const leerEditorial = async (req, res) => {
    try {
        const editoriales = await servicioLeerEditorial();
        res.status(200).json(editoriales);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
};

export const actualizarEditorial = async (req, res) => {
    try {
        const { id } = req.params;
        const editorial = await servicioActualizarEditorial(Number(id), req.body);
        res.status(200).json(editorial);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
};

export const eliminarEditorial = async (req, res) => {
    try {
        const { id } = req.params;
        await servicioEliminarEditorial(Number(id));
        res.status(200).json({ mensaje: "Editorial eliminada correctamente" });
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
};