import mongoose from "mongoose";
import Product from "../modules/product.js";
import products from "./data.js";

const seedProducts = async ()=>{
    try {
        await mongoose.connect("mongodb://localhost:27017/shopzone");

        await Product.deleteMany();
        console.log("Products are deleted");

        await Product.insertMany(products);
        console.log("Products are added");

        process.exit();
    } catch (e) {
        console.log(e.message);
        process.exit();
    }
}

seedProducts();