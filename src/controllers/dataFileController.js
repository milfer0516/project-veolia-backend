import fs from "fs/promises";
import getModelByProjectName from "../models/fileDataModel.js";

const uploadDataFiles = async (req, res) => {
	// Asegúrate de que el nombre del proyecto venga en el cuerpo de la solicitud
	console.log("Request Body:", req.body); // Para ver el cuerpo
	console.log("Uploaded File:", req.file);
	try {
		// Asegúrate de que el projectName venga en el cuerpo de la solicitud
		const { projectName } = req.body;

		if (!projectName) {
			return res
				.status(400)
				.json({ message: "El nombre del proyecto es obligatorio." });
		}

		// Obtener el modelo correcto basado en el nombre del proyecto
		const DataFileModel = getModelByProjectName(projectName);

		// Aquí el archivo ya está cargado en 'uploads/'
		const filePath = req.file.path;

		const jsonData = await fs.readFile(filePath, "utf8");
		const parsedData = JSON.parse(jsonData);

		// Agregar el campo projectName a cada elemento si no está presente
		const dataWithProjectName = parsedData.map((item) => ({
			...item,
			projectName, // Este campo ahora viene del formulario
		}));

		await DataFileModel.insertMany(dataWithProjectName); // Insertar en la colección del proyecto correspondiente
		res.json({ message: "Datos cargados exitosamente" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error al cargar los datos", error });
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
