import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

const products = [
  { name: "Laptop", price: 111800, stock: 5 },
  { name: "Phone", price: 17500, stock: 8 },
  { name: "Headphones", price: 1500, stock: 15 },
  { name: "Keyboard", price: 1000, stock: 12 },
  { name: "Mouse", price: 500, stock: 20 },
  { name: "Monitor", price: 8000, stock: 10 },
  { name: "Printer", price: 6000, stock: 7 },
  { name: "Tablet", price: 12000, stock: 9 },
  { name: "Smartwatch", price: 7000, stock: 14 },
  { name: "Camera", price: 25000, stock: 6 },
  { name: "Speakers", price: 3000, stock: 18 },
  { name: "External Hard Drive", price: 4000, stock: 11 },
  { name: "USB Flash Drive", price: 800, stock: 30 },
  { name: "Router", price: 3500, stock: 16 },
  { name: "Microphone", price: 4500, stock: 10 },
  { name: "Webcam", price: 2000, stock: 19 },
  { name: "Charger", price: 1500, stock: 25 },
  { name: "Power Bank", price: 2500, stock: 17 },
  { name: "Gaming Console", price: 30000, stock: 4 },
  { name: "VR Headset", price: 45000, stock: 3 },
  { name: "Smart Home Hub", price: 5000, stock: 8 },
  { name: "Fitness Tracker", price: 6000, stock: 12 },
  { name: "E-reader", price: 9000, stock: 10 },
  { name: "Projector", price: 22000, stock: 5 },
  { name: "Drone", price: 55000, stock: 2 },
  { name: "3D Printer", price: 75000, stock: 1 },
  { name: "Smart Light Bulb", price: 1200, stock: 20 },
  { name: "Smart Thermostat", price: 8000, stock: 7 },
  { name: "Electric Scooter", price: 40000, stock: 3 },
  { name: "Electric vape", price: 85000, stock: 2 },
  { name: "Action Camera", price: 15000, stock: 6 },
  { name: "Noise-Cancelling Headphones", price: 20000, stock: 8 },
  { name: "Smart Glasses", price: 60000, stock: 2 },
  { name: "Portable Speaker", price: 3500, stock: 14 },
  { name: "Smart Doorbell", price: 7000, stock: 9 },
  { name: "Smart Lock", price: 9000, stock: 10 },
  { name: "Robot Vacuum", price: 30000, stock: 4 },
  { name: "Air Purifier", price: 12000, stock: 8 },
  { name: "Electric Toothbrush", price: 4000, stock: 15 },
  { name: "Hair Dryer", price: 2500, stock: 12 },
  { name: "Electric Shaver", price: 3500, stock: 10 },
  { name: "Smart Scale", price: 5000, stock: 7 },
  { name: "Digital Photo Frame", price: 6000, stock: 6 },
  { name: "Smart Mirror", price: 20000, stock: 2 },
  { name: "Electric Grill", price: 8000, stock: 9 },
  { name: "Slow Cooker", price: 4500, stock: 8 },
  { name: "Air Fryer", price: 10000, stock: 11 },
  { name: "Rice Cooker", price: 3000, stock: 13 },
  { name: "Electric Kettle", price: 3000, stock: 20 },
  { name: "Coffee Maker", price: 7000, stock: 7 },
  { name: "Blender", price: 4000, stock: 15 },
];

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Product.deleteMany(); 
    await Product.insertMany(products); 

    console.log("✅ Products added successfully to MongoDB Atlas!");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding products:", err.message);
    process.exit(1);
  }
};

importData();
