import mongoose from "mongoose";

/**
 * Tyoe:
 *      - fixed: fixed price
 *      - percent: %
 */

export type DiscountDocument = mongoose.Document & {
    code: string;
    type: string;
    price: number;
    user: string;
    userName: string;
    product: string;
    productName: string;
    maxUse: number;
    nbrUse: number;
    startTime: Date;
    deadline: Date;
};

const discountSchema = new mongoose.Schema({
    code: String,
    type: String,
    price: Number,
    user: String,
    userName: String,
    product: String,
    productName: String,
    maxUse: Number,
    nbrUse: Number,
    startTime: Date,
    deadline: Date
}, { timestamps: true });

export const Discount = mongoose.model<DiscountDocument>("Discount", discountSchema);