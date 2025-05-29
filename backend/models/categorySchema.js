import mongoose from "mongoose";
import slugify from 'slugify';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    slug: { type: String, unique: true }, // New slug field
  },
  { timestamps: true }
);

// Middleware: Automatically generate a slug before saving
categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export const Category = mongoose.model("Category", categorySchema);

