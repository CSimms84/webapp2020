import mongoose from "mongoose";



const messageSchema = new mongoose.Schema({
    text: String,
    attachement: String,
    userId: String,
    roomId: String,
    seen: Array
}, { timestamps: true });

export type MessageDocument = mongoose.Document & {
    text: string;
    attachement: string;
    userId: string;
    roomId: string;
    seen: string[];
};

export const Message = mongoose.model<MessageDocument>("Message", messageSchema);



export type RoomDocument = mongoose.Document & {
    roomName: string;
    roomType: string;
    lastMessageDate: Date;
    users: string[];
};

const roomSchema = new mongoose.Schema({
    roomName: String,
    lastMessageDate: { type: Date, default: new Date() },
    roomType: { type: String, default: 'd' }, //d: direct or g: group 
    users: Array
}, { timestamps: true });

export const Room = mongoose.model<RoomDocument>("Room", roomSchema);