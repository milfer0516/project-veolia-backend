import mongoose from "mongoose";

// Definir el esquema común
const DataFileSchema = new mongoose.Schema({
	timestamp: {
		type: Date,
		required: true,
	},
	valor: {
		type: Number,
		required: true,
	},
	id: {
		type: String,
		required: true,
	},
	descripcion: {
		type: String,
		required: true,
	},
	unidades: {
		type: String,
		required: true,
	},
	projectName: {
		type: String,
		enum: ["EMPRESA_LACTEA", "HINTER", "ENERGIA", "TUNJA", "MONTERIA"],
		required: true,
	},
});

// Función para obtener el modelo dinámicamente según el proyecto
const getModelByProjectName = (projectName) => {
	// Crear el nombre de la colección usando el nombre del proyecto
	const modelName = `${projectName}_DataFile`;

	// Verificar si ya existe el modelo
	if (mongoose.models[modelName]) {
		return mongoose.models[modelName]; // Devolver el modelo existente si ya está definido
	}

	// Si no, definir y registrar el modelo
	return mongoose.model(modelName, DataFileSchema, modelName); // El tercer argumento es el nombre de la colección
};

export default getModelByProjectName;
