import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

const products = [
  { name: "Laptop", price: 111800 },
  { name: "Phone", price: 17500 },
  { name: "Headphones", price: 1500 },
  { name: "Keyboard", price: 1000 },
  { name: "Mouse", price: 500 },
  { name: "Monitor", price: 8000 },
  { name: "Printer", price: 6000 },
  { name: "Tablet", price: 12000 },
  { name: "Smartwatch", price: 7000 },
  { name: "Camera", price: 25000 },
  { name: "Speakers", price: 3000 },
  { name: "External Hard Drive", price: 4000 },
  { name: "USB Flash Drive", price: 800 },
  { name: "Router", price: 3500 },
  { name: "Microphone", price: 4500 },
  { name: "Webcam", price: 2000 },
  { name: "Charger", price: 1500 },
  { name: "Power Bank", price: 2500 },
  { name: "Gaming Console", price: 30000 },
  { name: "VR Headset", price: 45000 },
  { name: "Smart Home Hub", price: 5000 },
  { name: "Fitness Tracker", price: 6000 },
  { name: "E-reader", price: 9000 },
  { name: "Projector", price: 22000 },
  { name: "Drone", price: 55000 },
  { name: "3D Printer", price: 75000 },
  { name: "Smart Light Bulb", price: 1200 },
  { name: "Smart Thermostat", price: 8000 },
  { name: "Electric Scooter", price: 40000 },
  { name: "Electric vape", price: 85000 },
  { name: "Action Camera", price: 15000 },
  { name: "Noise-Cancelling Headphones", price: 20000 },
  { name: "Smart Glasses", price: 60000 },
  { name: "Portable Speaker", price: 3500 },
  { name: "Smart Doorbell", price: 7000 },
  { name: "Smart Lock", price: 9000 },
  { name: "Robot Vacuum", price: 30000 },
  { name: "Air Purifier", price: 12000 },
  { name: "Electric Toothbrush", price: 4000 },
  { name: "Hair Dryer", price: 2500 },
  { name: "Electric Shaver", price: 3500 },
  { name: "Smart Scale", price: 5000 },
  { name: "Digital Photo Frame", price: 6000 },
  { name: "Smart Mirror", price: 20000 },
  { name: "Electric Grill", price: 8000 },
  { name: "Slow Cooker", price: 4500 },
  { name: "Air Fryer", price: 10000 },
  { name: "Rice Cooker", price: 3000 },
  { name: "Electric Kettle", price: 3000 },
  { name: "Coffee Maker", price: 7000 },
  { name: "Blender", price: 4000 },
];

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Product.deleteMany(); // Clear old products
    await Product.insertMany(products);

    console.log("✅ Products added successfully to MongoDB Atlas!");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding products:", err.message);
    process.exit(1);
  }
};

importData();
