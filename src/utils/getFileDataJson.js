//import fs from "fs/promises"; // Use fs/promises for cleaner async/await syntax
import multer from "multer";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import fs from "node:fs";

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));

export const insertDataFromFile = multer({
	dest: join(CURRENT_DIR, "/uploads"),
	limits: {
		fileSize: 10000000, // 10MB
	},
	fileFilter: (req, file, cb) => {
		const filetypes = /json|csv/;
		const mimetype = filetypes.test(file.mimetype);
		const extname = filetypes.test(file.originalname.split(".").pop());

		if (mimetype && extname) {
			return cb(null, true); // Acepta el archivo
		}
		cb(new Error("Solo se permiten archivos JSON y CSV")); // Rechaza el archivo
	},
});

/**
 * The `saveFile` function saves a file to disk and returns the file path.
 * @param file - The `file` parameter in the `saveFile` function is an object that represents the file
 * being saved. It typically contains information such as the file's original name, path, and other
 * metadata related to the file.
 * @returns The function `saveFile` returns the file path where the file was saved on the disk.
 */
export const saveFile = (file) => {
	// Save file to disk
	const filePath = join(CURRENT_DIR, "./uploads", file.originalname);
	fs.renameSync(file.path, filePath);
	//console.log("File saved to:", filePath);
	return filePath;
};

/**
 * Función para procesar y eliminar el archivo después de guardar la información
 * @param {string} filePath - Ruta del archivo guardado
 */
export const processAndDeleteFile = async (filePath) => {
	try {
		// Aquí iría tu lógica para leer y procesar el archivo

		// Una vez procesado, eliminamos el archivo
		fs.unlinkSync(filePath);
		console.log("File deleted from:", filePath);
	} catch (error) {
		console.error("Error processing or deleting file:", error);
		throw new Error("Error al procesar o eliminar el archivo");
	}
};
