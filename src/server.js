import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/authRouter.js";
import getDataFile  from "./routes/dataFileRouter.js";
import bodyParser from "body-parser";
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
	process.env.URL_CONNECTION_FRONTEND,
];
app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error("Not allowed by CORS"));
			}
		},
		credentials: true, // Enable cookies
		exposedHeaders: ["Authorization"], // Make Authorization header available in client-side requests
		maxAge: 86400, // Set max-age to 1 day (86400 seconds)
		methods: ["GET", "POST", "PUT", "DELETE"], // Enable GET, POST, PUT, DELETE methods
		allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"], // Enable Content-Type, Authorization, and X-Requested-With headers
		preflightContinue: true, // Enable preflight request handling
		optionsSuccessStatus: 204, //
	})
);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Passport middleware



app.use("/api", authRouter);
// Upload CSV file
app.use("/api", getDataFile);


export default app;