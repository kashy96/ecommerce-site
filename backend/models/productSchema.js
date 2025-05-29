import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    slug: { type: String, unique: true },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // Reference to Category
      required: [true, "Product category is required"],
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      default: 0,
    },
    image: {
      type: String, 
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Middleware: Automatically generate a slug before saving
productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export const Product =  mongoose.model("Product", productSchema);
