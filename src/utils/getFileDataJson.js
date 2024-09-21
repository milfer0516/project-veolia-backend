import fs from "fs/promises"; // Use fs/promises for cleaner async/await syntax
import DataFileModel from "../models/fileDataModel.js";

export const insertDataFromFile = async (filePath) => {
	try {
		const jsonData = await fs.readFile(filePath, "utf8");
		const parsedData = JSON.parse(jsonData);

		// Validate and process data if needed (optional)
		// ... your validation/processing logic ...

		const dataToInsert = parsedData.map((item) => new DataFileModel(item));

		// Insert data in bulk for efficiency
		await DataFileModel.insertMany(dataToInsert);
		//console.log("Data from JSON file inserted successfully!");
	} catch (error) {
		console.error("Error reading or inserting data:", error);
		// Handle errors gracefully, e.g., log details and retry logic
	}
};

