import express from 'express';
const app = express();
import dotenv from 'dotenv';
import {connectDatabase} from "./config/dbConnect.js";
import errorMiddleware from './middlewares/error.js';
import cookieParser from "cookie-parser";

//Handle Uncaught exceptions
process.on("uncaughtException",(err)=>{
    console.log(`ERROR: ${err}`);
    console.log("Shutting down due to uncaught exception");
    process.exit(1);
})

dotenv.config({path:'backend/config/config.env'});

//Connecting to db
connectDatabase();

app.use(express.json());
app.use(cookieParser());

//Import all routes
import productRoutes from './routes/products.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';

app.use("/api", productRoutes);
app.use("/api", authRoutes);
app.use("/api", userRoutes);

//Using error middleware
app.use(errorMiddleware);

const server = app.listen(process.env.PORT,()=>{
    console.log(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
});

//Handle Unhandled Promise rejections
process.on("unhandledRejection", (err)=>{
    console.log(`ERROR: ${err}`);
    console.log("Shutting down server due to Unhandled Promise Rejection");
    server.close(()=>{
        process.exit(1);
    });
})

