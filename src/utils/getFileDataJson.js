import multer from "multer";
import path from "path";

// Configuración de almacenamiento de multer
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/"); // Carpeta donde se guardarán los archivos
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(
			null,
			file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
		);
	},
});

// Configuración de multer
const upload = multer({
	storage,
	fileFilter: (req, file, cb) => {
		const allowedTypes = ["application/json", "text/csv"]; // Añade otros tipos si es necesario
		if (!allowedTypes.includes(file.mimetype)) {
			return cb(new Error("Tipo de archivo no permitido"), false);
		}
		cb(null, true);
	},
});

export const uploadFileMiddleware = upload.single("file"); // 'file' será el nombre del campo en el formulario
