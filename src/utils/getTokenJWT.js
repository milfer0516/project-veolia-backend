import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateToken = (_id, email) => {
	const token = jwt.sign(
		{ _id, email },
		process.env.JWT_SECRET,
		{
			expiresIn: process.env.JWT_TIMEOUT,
		}
	);
	return token;
};
