import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
	name: {
		type: String,
	},
	email: {
		type: String,
		unique: true,
		index: true, // Esto mejora el rendimiento en consultas
	},
	picture: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: Date.now, // Establece la fecha actual como valor por defecto
	},
});


const UserModel = mongoose.model("User", UserSchema);

export default UserModel;