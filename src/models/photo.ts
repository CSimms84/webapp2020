import mongoose from "mongoose";

export type PhotoDocument = mongoose.Document & {
    content: string;
};

const photoSchema = new mongoose.Schema({
    content: String
}, { timestamps: true });
