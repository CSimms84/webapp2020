import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";

export type TimezoneDocument = mongoose.Document & {
    userId: string;
    timezone: string;
};

const timezoneSchema = new mongoose.Schema({
    userId: String,
    timezone: String
}, { timestamps: true });

export const Timezone = mongoose.model<TimezoneDocument>("Timezone", timezoneSchema);

export const setTimeZone = async (req: Request, res: Response) => {

   const time = {
    timezone: req.body.timezone
   }

    Timezone.findOneAndUpdate({userId: req.body._id}, time, {upsert: true}, function(err, doc) {
        if (err) {
            return res
            .status(500)
            .send({ error: true, message: "addTimeZone" }); 
        }
        return res
        .status(200)
        .send({ error: false, data: 'success'});
    });

};


export const getTimeZone = async (userId:string) => {
 
 
 
  return  await Timezone.findOne({ userId: userId });
 
 };