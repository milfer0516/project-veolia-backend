import { Router } from "express";
import {
	getDataByProject,
	getDataFiles,
	uploadFile,
} from "../controllers/dataFileController.js";
import { insertDataFromFile } from "../utils/getFileDataJson.js";

const router = Router();

router.get("/project/:projectName", getDataByProject);

router.post("/upload-data", insertDataFromFile.single("file"), uploadFile);

router.get("/getFileData", getDataFiles);

export default router;