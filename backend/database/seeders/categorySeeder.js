import mongoose from "mongoose";
import dotenv from "dotenv";
import { Category } from "../../models/categorySchema.js";
import databaseConnection from "../../config/dbConnection.js"
import slugify from "slugify";

// Load environment variables
dotenv.config();

// Sample categories
const categories = [
  { name: "Bags", description: "All bags" },
  { name: "Drinkware", description: "Inlcude cups, glasses etc." },
  { name: "Electronics", description: "All electronic gadgets" },
  { name: "Footware", description: "Sleepers, shoes, chappals etc." },
  { name: "Headwear", description: "Caps, helmets etc." },
  { name: "Hoodies", description: "Include hoodies for cold" },
  { name: "Jackets", description: "All kind of jackets" },
  { name: "Kids", description: "Any kids accessories" },
  { name: "Pets", description: "Pets wearings" },
  { name: "Shirts", description: "Any kind of shirts" },
  { name: "Stickers", description: "All stickers" },
];

// Function to seed categories
const seedCategories = async () => {
  try {
    await databaseConnection(); // Connect to database
    await Category.deleteMany(); // Clear existing categories

    // Add slug to each category
    const categoriesWithSlugs = categories.map((category) => ({
        ...category,
        slug: slugify(category.name, { lower: true, strict: true }),
    }));

    const createdCategories = await Category.insertMany(categoriesWithSlugs);
    console.log("✅ Categories Seeded:", createdCategories);
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    process.exit(1);
  }
};

// Run the seeder
seedCategories();
