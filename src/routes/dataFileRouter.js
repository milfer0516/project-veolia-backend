import { Router } from "express";
import {
	getDataFiles,
	uploadDataFiles,
} from "../controllers/dataFileController.js";

//import { getDataFiles } from "../controllers/dataFileController.js";


const router = Router();

router.post("/upload-data", uploadDataFiles);

router.get("/getFileData", getDataFiles);

export default router;