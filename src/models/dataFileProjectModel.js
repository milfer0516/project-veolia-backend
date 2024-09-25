import mongoose, { Schema } from "mongoose";

/**
 * Función para obtener un modelo dinámico según el nombre del proyecto
 * @param projectName - El nombre del proyecto
 * @returns Un modelo dinámico de Mongoose que apunta a la colección correspondiente
 */
const DataFileForProject = (projectName) => {
	// Definimos un esquema para los datos que estás guardando
	const schema = new mongoose.Schema({
		timestamp: Date,
		valor: Number,
		id: String,
		descripcion: String,
		unidades: String,
	});

	// Comprueba si el modelo ya existe para evitar el error
	if (mongoose.models[projectName]) {
		return mongoose.models[projectName];
	}

	// Devuelve un modelo dinámico que se vincula a la colección del proyecto
	return mongoose.model(projectName, schema, projectName);
};

export default DataFileForProject;
