import mongoose from "mongoose";
import dotenv from "dotenv";
import { Category } from "../../models/categorySchema.js";
import { Product } from "../../models/productSchema.js";
import databaseConnection from "../../config/dbConnection.js"
import slugify from "slugify";

// Load environment variables
dotenv.config();

// Sample products
const seedProducts = async () => {
  try {
    await databaseConnection();
    // await Product.deleteMany(); // Clear existing products

    // Fetch categories
    const categories = await Category.find();
    if (categories.length === 0) {
      console.log("No categories found. Run categorySeeder.js first!");
      process.exit(1);
    }

    // const products = [
    //   // Electronics
    //   {
    //     name: "iPhone 14 Pro",
    //     description: "Apple's flagship smartphone with advanced camera system.",
    //     price: 1099.99,
    //     category: categories.find((cat) => cat.name === "Electronics")._id,
    //     stock: 50,
    //     image: "https://m.media-amazon.com/images/I/61YPFyJYMOL._AC_SL1500_.jpg",
    //   },
    //   {
    //     name: "Samsung 4K Smart TV",
    //     description: "55-inch 4K Ultra HD Smart LED TV with HDR.",
    //     price: 599.99,
    //     category: categories.find((cat) => cat.name === "Electronics")._id,
    //     stock: 25,
    //     image: "https://m.media-amazon.com/images/I/71q0GnQ8NFL._AC_SL1500_.jpg",
    //   },
    //   {
    //     name: "Sony Noise Cancelling Headphones",
    //     description: "Wireless noise-cancelling over-ear headphones with premium sound.",
    //     price: 349.99,
    //     category: categories.find((cat) => cat.name === "Electronics")._id,
    //     stock: 40,
    //     image: "https://m.media-amazon.com/images/I/71uUA4mWvkL._AC_SL1500_.jpg",
    //   },
    //   {
    //     name: "Apple MacBook Air M2",
    //     description: "Lightweight laptop with powerful M2 chip.",
    //     price: 1199.99,
    //     category: categories.find((cat) => cat.name === "Electronics")._id,
    //     stock: 30,
    //     image: "https://m.media-amazon.com/images/I/71h8MQkRJYL._AC_SL1500_.jpg",
    //   },
    //   {
    //     name: "GoPro HERO11 Black",
    //     description: "Action camera with 5.3K video and waterproof design.",
    //     price: 399.99,
    //     category: categories.find((cat) => cat.name === "Electronics")._id,
    //     stock: 35,
    //     image: "https://m.media-amazon.com/images/I/61tNji8KrEL._AC_SL1500_.jpg",
    //   },
    
    //   // Fashion
    //   {
    //     name: "Nike Air Max 270",
    //     description: "Comfortable running shoes with air cushion technology.",
    //     price: 149.99,
    //     category: categories.find((cat) => cat.name === "Fashion")._id,
    //     stock: 100,
    //     image: "https://m.media-amazon.com/images/I/61mT0flQL-L._AC_SL1500_.jpg",
    //   },
    //   {
    //     name: "Levi's 501 Original Jeans",
    //     description: "Classic straight-leg denim jeans.",
    //     price: 69.99,
    //     category: categories.find((cat) => cat.name === "Fashion")._id,
    //     stock: 80,
    //     image: "https://m.media-amazon.com/images/I/81OIU4vXDhL._AC_SL1500_.jpg",
    //   },
    //   {
    //     name: "North Face Venture Jacket",
    //     description: "Waterproof and breathable outdoor jacket.",
    //     price: 99.99,
    //     category: categories.find((cat) => cat.name === "Fashion")._id,
    //     stock: 50,
    //     image: "https://m.media-amazon.com/images/I/71J+MLkRPNL._AC_SL1500_.jpg",
    //   },
    //   {
    //     name: "Ray-Ban Aviator Sunglasses",
    //     description: "Classic metal frame sunglasses with polarized lenses.",
    //     price: 179.99,
    //     category: categories.find((cat) => cat.name === "Fashion")._id,
    //     stock: 60,
    //     image: "https://m.media-amazon.com/images/I/61ZmUtuHmzL._AC_SL1500_.jpg",
    //   },
    //   {
    //     name: "Adidas Ultraboost Running Shoes",
    //     description: "High-performance running shoes with responsive cushioning.",
    //     price: 179.99,
    //     category: categories.find((cat) => cat.name === "Fashion")._id,
    //     stock: 70,
    //     image: "https://m.media-amazon.com/images/I/71UUv1PGtFL._AC_SL1500_.jpg",
    //   },
    
    //   // Home & Kitchen
    //   {
    //     name: "Vitamix Blender",
    //     description: "Professional-grade blender for smoothies and food processing.",
    //     price: 549.99,
    //     category: categories.find((cat) => cat.name === "Home & Kitchen")._id,
    //     stock: 25,
    //     image: "https://m.media-amazon.com/images/I/61-i0vTHl-L._AC_SL1500_.jpg",
    //   },
    //   {
    //     name: "Instant Pot Duo",
    //     description: "7-in-1 Electric Pressure Cooker with multiple cooking functions.",
    //     price: 99.99,
    //     category: categories.find((cat) => cat.name === "Home & Kitchen")._id,
    //     stock: 50,
    //     image: "https://m.media-amazon.com/images/I/71DgnOJQ5RL._AC_SL1500_.jpg",
    //   },
    //   {
    //     name: "Keurig K-Elite Coffee Maker",
    //     description: "Single-serve coffee maker with multiple brew sizes.",
    //     price: 149.99,
    //     category: categories.find((cat) => cat.name === "Home & Kitchen")._id,
    //     stock: 40,
    //     image: "https://m.media-amazon.com/images/I/71CXPfofGOL._AC_SL1500_.jpg",
    //   },
    //   {
    //     name: "Dyson V11 Vacuum Cleaner",
    //     description: "Cordless stick vacuum with powerful suction and long battery life.",
    //     price: 599.99,
    //     category: categories.find((cat) => cat.name === "Home & Kitchen")._id,
    //     stock: 30,
    //     image: "https://m.media-amazon.com/images/I/71hLql848FL._AC_SL1500_.jpg",
    //   },
    //   {
    //     name: "KitchenAid Stand Mixer",
    //     description: "Professional stand mixer with multiple attachments.",
    //     price: 449.99,
    //     category: categories.find((cat) => cat.name === "Home & Kitchen")._id,
    //     stock: 35,
    //     image: "https://m.media-amazon.com/images/I/71-ICUqOO7L._AC_SL1500_.jpg",
    //   },
    
    //   // Beauty & Personal Care
    //   {
    //     name: "Clarisonic Mia Smart Facial Cleansing Device",
    //     description: "Advanced facial cleansing brush with multiple settings.",
    //     price: 199.99,
    //     category: categories.find((cat) => cat.name === "Beauty & Personal Care")._id,
    //     stock: 40,
    //     image: "https://m.media-amazon.com/images/I/61u48FEs5TL._AC_SL1500_.jpg",
    //   },
    //   {
    //     name: "The Ordinary Skincare Set",
    //     description: "Comprehensive skincare collection with multiple serums.",
    //     price: 79.99,
    //     category: categories.find((cat) => cat.name === "Beauty & Personal Care")._id,
    //     stock: 60,
    //     image: "https://m.media-amazon.com/images/I/61ky2FUTmfL._SL1000_.jpg",
    //   },
    //   {
    //     name: "Foreo Luna Facial Cleansing Brush",
    //     description: "Silicone facial cleansing device for deep skin treatment.",
    //     price: 169.99,
    //     category: categories.find((cat) => cat.name === "Beauty & Personal Care")._id,
    //     stock: 45,
    //     image: "https://m.media-amazon.com/images/I/61p3PywG-OL._SL1500_.jpg",
    //   },
    //   {
    //     name: "Olaplex Hair Repair Treatment Kit",
    //     description: "Professional hair repair and strengthening treatment set.",
    //     price: 89.99,
    //     category: categories.find((cat) => cat.name === "Beauty & Personal Care")._id,
    //     stock: 50,
    //     image: "https://m.media-amazon.com/images/I/61BQlXRjHdL._SL1500_.jpg",
    //   },
    //   {
    //     name: "Philips Norelco Electric Shaver",
    //     description: "Advanced electric shaver with multiple cutting elements.",
    //     price: 129.99,
    //     category: categories.find((cat) => cat.name === "Beauty & Personal Care")._id,
    //     stock: 55,
    //     image: "https://m.media-amazon.com/images/I/71zqjkzXWOL._SL1500_.jpg",
    //   },
    
    //   // Sports
    //   {
    //     name: "Wilson Pro Staff Tennis Racket",
    //     description: "Professional-grade tennis racket used by top players.",
    //     price: 249.99,
    //     category: categories.find((cat) => cat.name === "Sports")._id,
    //     stock: 40,
    //     image: "https://m.media-amazon.com/images/I/81O5hWzVSJL._AC_SL1500_.jpg",
    //   },
    //   {
    //     name: "Nike Mercurial Soccer Cleats",
    //     description: "High-performance soccer cleats for professional and amateur players.",
    //     price: 279.99,
    //     category: categories.find((cat) => cat.name === "Sports")._id,
    //     stock: 50,
    //     image: "https://m.media-amazon.com/images/I/61-VBGx2XML._AC_SL1500_.jpg",
    //   },
    //   {
    //     name: "Spalding NBA Official Basketball",
    //     description: "Official size and weight basketball used in professional leagues.",
    //     price: 49.99,
    //     category: categories.find((cat) => cat.name === "Sports")._id,
    //     stock: 75,
    //     image: "https://m.media-amazon.com/images/I/81Qw7nzjCyL._AC_SL1500_.jpg",
    //   },
    //   {
    //     name: "Roller Hockey Inline Skates",
    //     description: "Professional-grade inline skates for competitive roller hockey.",
    //     price: 199.99,
    //     category: categories.find((cat) => cat.name === "Sports")._id,
    //     stock: 30,
    //     image: "https://m.media-amazon.com/images/I/61hh6GvQmBL._AC_SL1500_.jpg",
    //   },
    //   {
    //     name: "TRX Suspension Training System",
    //     description: "Complete full-body workout suspension training kit.",
    //     price: 169.99,
    //     category: categories.find((cat) => cat.name === "Sports")._id,
    //     stock: 45,
    //     image: "https://m.media-amazon.com/images/I/71GQf0YIZJL._AC_SL1500_.jpg",
    //   },
    
    //   // Books
    //   {
    //     name: "Dune by Frank Herbert",
    //     description: "Classic science fiction novel, winner of multiple awards.",
    //     price: 15.99,
    //     category: categories.find((cat) => cat.name === "Books")._id,
    //     stock: 100,
    //     image: "https://m.media-amazon.com/images/I/81ym3iii6WL._SL1500_.jpg",
    //   },
    //   {
    //     name: "Atomic Habits by James Clear",
    //     description: "Transformative book on building good habits and breaking bad ones.",
    //     price: 18.99,
    //     category: categories.find((cat) => cat.name === "Books")._id,
    //     stock: 85,
    //     image: "https://m.media-amazon.com/images/I/81wTiDOE0zL._SL1500_.jpg",
    //   },
    //   {
    //     name: "A Brief History of Time by Stephen Hawking",
    //     description: "Groundbreaking exploration of cosmology and theoretical physics.",
    //     price: 16.99,
    //     category: categories.find((cat) => cat.name === "Books")._id,
    //     stock: 70,
    //     image: "https://m.media-amazon.com/images/I/81mY+XjNVNL._SL1500_.jpg",
    //   },
    //   {
    //     name: "The Night Circus by Erin Morgenstern",
    //     description: "Magical realism novel about a mysterious traveling circus.",
    //     price: 14.99,
    //     category: categories.find((cat) => cat.name === "Books")._id,
    //     stock: 60,
    //     image: "https://m.media-amazon.com/images/I/91hliuDiFOL._SL1500_.jpg",
    //   },
    //   {
    //     name: "Sapiens: A Brief History of Humankind",
    //     description: "Comprehensive exploration of human history and evolution.",
    //     price: 19.99,
    //     category: categories.find((cat) => cat.name === "Books")._id,
    //     stock: 75,
    //     image: "https://m.media-amazon.com/images/I/71qC7zimbabL._SL1500_.jpg",
    //   }
    // ];

    // const createdProducts = await Product.insertMany(products);
    // console.log("Products Seeded:", createdProducts.length);
    process.exit();
  } catch (error) {
    console.error("Error seeding products:", error);
    process.exit(1);
  }
};

seedProducts();