import mongoose from "mongoose";


const commentSchema = new mongoose.Schema({
    text: String,
    content: String,
    contentType: String,
    likes: Array,
    type: String,
    userId: String,
    postId: String,
}, { timestamps: true });

export type CommentDocument = mongoose.Document & {
    text: string;
    content: string;
    contentType: string;
    likes: string[];
    liked: boolean;
    type: string;
    userId: string;
    user: Object;
    postId: string;
};

export const Comment = mongoose.model<CommentDocument>("Comment", commentSchema);

export type PostDocument = mongoose.Document & {
    text: string;
    content: string;
    contentType: string;
    type: string;
    likes: string[];
    comments: any;
    locations: number[];
    userId: string;
};

const postSchema = new mongoose.Schema({
    text: String,
    content: String,
    contentType: String,
    type: String,
    likes: Array,
    locations: Array,
    userId: String
}, { timestamps: true });

export const Post = mongoose.model<PostDocument>("Post", postSchema);