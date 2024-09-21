import DataFileModel from "../models/fileDataModel.js";
import { insertDataFromFile } from "../utils/getFileDataJson.js";

const uploadDataFiles = async (req, res) => {
	try {
		// Handle file upload (replace with your preferred method)
		const filePath = process.env.PATH_FILE_JSON;

		await insertDataFromFile(filePath);
		res.json({ message: "Data uploaded successfully!" });
	} catch (error) {
		console.error("Error uploading data:", error);
		res.status(500).json({ message: "Error uploading data" }); // Handle errors appropriately
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



export { uploadDataFiles, getDataFiles };
