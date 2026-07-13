import mongoose from "mongoose";

const { Schema, model } = mongoose;

const gallerySchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: true,
      enum: ["micro-locs", "retwist", "interlocking", "braids"],
      default: "micro-locs",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    uploadedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, toJSON: { virtuals: true } },
);

const Gallery = model("Gallery", gallerySchema);

export default Gallery;
