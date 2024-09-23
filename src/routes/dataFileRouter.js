import { Router } from "express";
import { uploadFileMiddleware } from "../utils/getFileDataJson.js";
import {
	getDataFiles,
	uploadDataFiles,
} from "../controllers/dataFileController.js";

//import { getDataFiles } from "../controllers/dataFileController.js";

const router = Router();

router.post("/upload-data", uploadFileMiddleware, uploadDataFiles);

router.get("/getFileData", getDataFiles);

export default router;