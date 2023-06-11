import mongoose from "mongoose";
export const geoSchema = new mongoose.Schema({
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number]
    }
  });