import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/authRouter.js";
import getDataFile  from "./routes/dataFileRouter.js";
//import passport from 'passport';
import cors from "cors";
import { connectionDB } from "./config/connectionDB.js";
dotenv.config(); // Load environment variables from.env file

const app = express();
connectionDB(); // Connect to MongoDB database

// Enable CORS for cross-origin requests
const allowedOrigins = [
	"http://localhost:3000",
	"http://localhost:5173",
	"https://veoliaxs-front.vercel.app",
];
app.use(cors());


app.use(express.json());


app.use("/api", authRouter);
// Upload CSV file
app.use("/api", getDataFile);


export default app;