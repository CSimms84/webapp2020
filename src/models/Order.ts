import mongoose from "mongoose";

/**
 * Tyoe:
 *      - fixed: fixed price
 *      - percent: %
 */

export type OrderDocument = mongoose.Document & {
    user: string;
    userInfo: string;
    product: string;
    productInfo: string;
    coupon: string;
    couponInfo: string;
    subtotal: string;
    discount: string;
    total: string;
};

const orderSchema = new mongoose.Schema({
    user: String,
    userInfo: String,
    product: String,
    productInfo: String,
    coupon: String,
    couponInfo: String,
    subtotal: String,
    discount: String,
    total: String
}, { timestamps: true });

export const Order = mongoose.model<OrderDocument>("Order", orderSchema);