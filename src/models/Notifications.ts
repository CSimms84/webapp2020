import mongoose from "mongoose";

export type NotificationDocument = mongoose.Document & {
    text: string;
    url: string;
    user: string;
    type: string;
    seen: boolean;
};

const notificationSchema = new mongoose.Schema({
    text: String,
    url: String,
    user: String,
    type: String,
    seen: { type: Boolean, default: false }
}, { timestamps: true });

export const Notification = mongoose.model<NotificationDocument>("Notification", notificationSchema);