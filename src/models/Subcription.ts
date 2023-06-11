import mongoose from "mongoose";

export type SubscriptionDocument = mongoose.Document & {
    name: string;
    role: string;
    price: number;
    pricePromo: number;
    recursion: string;
    description: string;
    public: boolean;
    promo: boolean;
    starts: Date;
    ends: Date;
};

const subscriptionSchema = new mongoose.Schema({
    name: String,
    role: String,
    price: Number,
    pricePromo: Number,
    recursion: String,
    description: String,
    public: Boolean,
    promo: Boolean,
    starts: Date,
    ends: Date
}, { timestamps: true });

export const Subscription = mongoose.model<SubscriptionDocument>("Subscription", subscriptionSchema);