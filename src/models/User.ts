import bcrypt from "bcrypt-nodejs";
import crypto from "crypto";
import mongoose from "mongoose";
import { geoSchema } from "./Geo";

export type UserDocument = mongoose.Document & {
    email: string;
    username: string;
    password: string;
    passwordResetToken: string;
    passwordResetExpires: Date;
    role: string;
    discount: number;
    account: string;
    facebook: string;
    tokens: IAuthToken[];
    acceptTerms: Boolean;
    distance: number;
    profile: {
        name: string;
        about: string;
        gender: string;
        age: number;
        country: string;
        phone: string;
        zipcode: string;
        state: string;
        city: string;
        speed: number;
        time: number;
        nbrEmp: number;
        address: string;
        tax: string;
        gallery: string[];
        requests: string[];
        friends: string[];
        weight: string;
        picture: string;
        card: ICard;
        location: any;
    };

    comparePassword: comparePasswordFunction;

    disabled: Boolean;
    gravatar: (size: number) => string;
};

type comparePasswordFunction = (candidatePassword: string, cb: (err: any, isMatch: any) => {}) => void;

export interface IAuthToken {
    accessToken: string;
    kind: string;
}

interface ICard {
    cNumber: string;
    cMonth: number;
    cYear: number;
}

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    passwordResetToken: String,
    passwordResetExpires: Date,
    role: String,
    discount: Number,
    account: String,
    facebook: String,
    twitter: String,
    google: String,
    tokens: Array,
    distance: Number,
    profile: {
        name: String,
        about: String,
        gender: String,
        age: Number,
        country: String,
        phone: String,
        zipcode: String,
        state: String,
        city: String,
        speed: Number,
        time: Number,
        gallery: Array,
        requests: Array,
        friends: Array,
        weight: String,
        picture: String,
        nbrEmp: Number,
        address: String,
        tax: String,
        card: Object,
        location: {
            type: geoSchema,
            index: '2dsphere'
        }
    },
    disabled: Boolean,
    acceptTerms: Boolean
}, { timestamps: true });
userSchema.index({ location: "2dsphere" });

/**
 * Password hash middleware.
 */
userSchema.pre("save", function save(next) {

    /**TODO Stripe */
    const user = this as UserDocument;
    user.disabled = false;
    if (!user.profile?.picture) {
        user.profile.picture = user.gravatar(0);
    }
    if (!user.isModified("password")) { return next(); }
    
    
    
    bcrypt.genSalt(10, (err, salt) => {
        if (err) { return next(err); }
        bcrypt.hash(user.password, salt, () => { }, (err: mongoose.Error, hash: string) => {
            if (err) { return next(err); }
            user.password = hash;
            next();
        });
    });
});
userSchema.pre("updateOne", function save(next) {

    
    
    
    const user = this.getUpdate().$set as UserDocument;

   // if (!user.isModified("password")) { return next(); }
    if (user.password) {
        
        
        
        bcrypt.genSalt(10, (err, salt) => {
            if (err) { return next(err); }
            bcrypt.hash(user.password, salt, () => { }, (err: mongoose.Error, hash: string) => {
                if (err) { return next(err); }
                user.password = hash;
                next();
            });
        });
    }else{
        
        next();
    }
});

const comparePassword: comparePasswordFunction = function (this: any, candidatePassword, cb) {
    const user: any = this as UserDocument;
    const pass: string = user.password;
    bcrypt.compare(candidatePassword, pass, (err: mongoose.Error, isMatch: boolean) => {
        cb(err, isMatch);
    });
};



userSchema.methods.comparePassword = comparePassword;

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function (size: number = 200) {
    if (!this.email) {
        return `https://gravatar.com/avatar/?s=${size}&d=retro`;
    }
    const md5 = crypto.createHash("md5").update(this.email).digest("hex");
    return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

export const User = mongoose.model<UserDocument>("User", userSchema);