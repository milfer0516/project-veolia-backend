import request from "supertest";
import app from "../app";
import { getToken } from "../utils/getToken";
import { findOneAndUpdate } from "../models/User";
import { verify } from "jsonwebtoken";
import mongoose from "mongoose";

jest.mock("../utils/getToken");
jest.mock("../models/User");

describe("Google Authentication Route", () => {
	let mockCode;

	beforeEach(() => {
		mockCode = "mockedAuthorizationCode";
		// Restablecer los mocks antes de cada prueba
		jest.clearAllMocks();
	});

	it("should handle successful authentication", async () => {
		const response = await request(app)
			.get("/google")
			.query({ code: mockCode });

		expect(response.statusCode).toBe(302);
		expect(response.header["location"]).toMatch(/auth\/success\?token=/);
		// Verificar el token generado
		const token = response.header["location"].split("=")[1];
		const decodedToken = verify(token, process.env.JWT_SECRET);
		expect(decodedToken.id).toBe("mockedUserId");
		expect(decodedToken.email).toBe("test@example.com");

		// Verifica que getToken haya sido llamado con el código correcto
		expect(getToken).toHaveBeenCalledWith(mockCode);
	});

	it("should handle errors when code is missing", async () => {
		const response = await request(app).get("/google");

		expect(response.statusCode).toBe(400);
		expect(response.body.message).toBe("No authorization code provided");
	});

	it("should handle errors when getToken fails", async () => {
		getToken.mockRejectedValueOnce(new Error("Network error"));

		const response = await request(app)
			.get("/google")
			.query({ code: mockCode });

		expect(response.statusCode).toBe(500);
		expect(response.body.message).toMatch(/Error during Google callback/);
	});

	it("should handle errors when updating user fails", async () => {
		findOneAndUpdate.mockRejectedValueOnce(
			new Error("Database error")
		);

		const response = await request(app)
			.get("/google")
			.query({ code: mockCode });

		expect(response.statusCode).toBe(500);
		expect(response.body.message).toMatch(/Error during Google callback/);
	});

	it("should handle existing user", async () => {
		findOneAndUpdate.mockResolvedValueOnce({
			_id: "existingUserId",
			// ... otros datos del usuario
		});

		const response = await request(app)
			.get("/google")
			.query({ code: mockCode });

		// Verificar que se actualice el usuario existente
		expect(findOneAndUpdate).toHaveBeenCalledWith(
			{ googleId: "123456789" }
			// ...
		);
	});

	it("should handle invalid code", async () => {
		getToken.mockResolvedValueOnce(null); // Simular un token inválido

		const response = await request(app)
			.get("/google")
			.query({ code: mockCode });

		expect(response.statusCode).toBe(400);
		expect(response.body.message).toMatch(/Invalid authorization code/);
	});

	it("should handle invalid JWT secret", async () => {
		jest.spyOn(process.env, "JWT_SECRET", "get").mockReturnValue(undefined);

		const response = await request(app)
			.get("/google")
			.query({ code: mockCode });

		expect(response.statusCode).toBe(500);
		expect(response.body.message).toMatch(/Invalid JWT secret/);
	});
});
