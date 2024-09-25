import DataFileModel from "../models/fileDataModel.js";
import DataFileForProject from "../models/dataFileProjectModel.js";
//import { getModelForProject } from "../models/getDataForProject.js";
import fs from "fs/promises";
import { processAndDeleteFile, saveFile } from "../utils/getFileDataJson.js";

/**
 * The `uploadFile` function uploads a file, reads its contents, and saves the data to the appropriate collection
 * based on the project name.
 * @param req - The request object containing the file and project name.
 * @param res - The response object to send the status and message.
 */
export const uploadFile = async (req, res) => {
	try {
		const { file } = req;
		const { projectName } = req.body; // Suponiendo que el nombre del proyecto viene en el body de la solicitud

		if (!file || !projectName) {
			return res
				.status(400)
				.send("No se ha subido ningún archivo o falta el nombre del proyecto.");
		}

		// Guardamos el archivo en el disco
		const filePath = saveFile(file);

		// Leemos el archivo JSON desde el disco
		const fileContent = await fs.readFile(filePath, "utf-8");

		// Parseamos el contenido del archivo JSON
		const jsonData = JSON.parse(fileContent);

		// Obtenemos el modelo dinámico basado en el nombre del proyecto
		const ProjectModel = DataFileForProjectSchema(projectName);

		// Guardamos múltiples documentos si es un array
		if (Array.isArray(jsonData)) {
			// Guardamos todos los documentos en la colección correspondiente
			const savedDocuments = await ProjectModel.insertMany(jsonData);
			console.log("Data saved to DB: ", savedDocuments);
		} else {
			// Guardamos un solo documento si no es un array
			const newDocument = new ProjectModel(jsonData);
			await newDocument.save();
			console.log("Data saved to DB: ", newDocument);
		}

		await processAndDeleteFile(filePath);

		// Respuesta exitosa
		res
			.status(201)
			.json({ message: "Archivo subido y datos guardados correctamente" });
	} catch (error) {
		console.error("Error uploading file:", error);
		res.status(500).send("Error al procesar el archivo");
	}
};

/**
 * Controlador para obtener datos de un proyecto específico
 * @param {Request} req - Objeto de la solicitud
 * @param {Response} res - Objeto de la respuesta
 */

import DataFileForProjectSchema from "../models/dataFileProjectModel.js"; // Asegúrate de que la ruta sea correcta

export const getDataByProject = async (req, res) => {
	const { projectName } = req.params; // Asumiendo que pasas el nombre del proyecto en la URL

	try {
		// Obtiene el modelo para el proyecto específico
		const DataModel = DataFileForProject(projectName);

		// Realiza la consulta a la colección
		const data = await DataModel.find({});

		if (!data || data.length === 0) {
			return res
				.status(404)
				.json({ message: "No se encontraron datos para este proyecto." });
		}

		console.log(data);

		return res.status(200).json(data);
	} catch (error) {
		console.error("Error obteniendo datos:", error.message);
		return res.status(500).json({ message: "Error al obtener los datos" });
	}
};

// API backend para obtener datos paginados por proyecto
const getDataFiles = async (req, res) => {
	const { projectId, page = 1, limit = 20 } = req.query; // Parámetros de paginación y proyecto

	try {
		const { tag, page = 1, limit = 20 } = req.query; // Obtener el 'tag' y los parámetros de paginación

		const query = tag ? { tag } : {}; // Si se pasa el tag, filtramos por ese valor

		// Realizamos la consulta con paginación
		const data = await DataFileModel.find(query)
			.skip((page - 1) * limit)
			.limit(parseInt(limit));

		const totalCount = await DataFileModel.countDocuments(query); // Contamos el total de documentos
		console.log(data);

		res.json({
			data,
			currentPage: parseInt(page),
			totalPages: Math.ceil(totalCount / limit),
			totalItems: totalCount,
		});
	} catch (error) {
		res.status(500).json({ error: "Error al obtener los datos" });
	}
};

// API

export { getDataFiles };
