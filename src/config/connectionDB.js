import mongoose from "mongoose";
import { exit } from "node:process";


// Replace with your MongoDB connection string
export const connectionDB = async () => {
	try {
		const { connection } = await mongoose.connect(process.env.URL_CONNECTIONDB);
		const url = `${connection.host}:${connection.port}`;
		console.log(`Conectado a MongoDB: ${url}`);
	} catch (error) {
		console.log("Error al conectarse a MongoDBd");
		exit(1);
	}
};
