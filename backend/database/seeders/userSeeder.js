import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { User } from "../../models/userSchema.js";
import databaseConnection from "../../config/dbConnection.js"

// Load environment variables
dotenv.config();

// Sample Users
const seedUsers = async () => {
  try {
    await databaseConnection(); // Assuming this is your database connection function
    await User.deleteMany(); // Clear any existing users

    // Create sample users
    const users = [
      {
        name: "Admin",
        email: "admin@example.com",
        password: "password123",
        role: "admin",
      },
      {
        name: "Customer",
        email: "customer@example.com",
        password: "password123",
        role: "customer",
      },
    ];

    // Hash passwords asynchronously for each user
    const userWithHashedPasswords = await Promise.all(
      users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);

        return {
          ...user,
          password: hashedPassword,
        };
      })
    );

    // Insert users into the database
    const usersCreated = await User.insertMany(userWithHashedPasswords);
    console.log("Users Seeded:", usersCreated);
    process.exit();
  } catch (error) {
    console.error("Error seeding users:", error);
    process.exit(1);
  }
};

seedUsers();
