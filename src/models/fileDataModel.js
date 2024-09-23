import mongoose, { Schema } from "mongoose";

const DataFileSchema = new Schema({
	tag: {
		type: String,
	},
	Moment: {
		type: Date,
	},
	State: {
		type: String,
	},
	Value: Number,
	insertion_timestamp: { type: Date, default: Date.now },
});

const DataFileModel = mongoose.model("Data_File", DataFileSchema);

export default DataFileModel;