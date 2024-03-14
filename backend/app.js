import express from 'express';
import dotenv from 'dotenv';
import productRoutes from './routes/products.js';
import {connectDatabase} from "./config/dbConnect.js";
import errorMiddleware from './middlewares/error.js';

const app = express();

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

//Import all routes
app.use('/api',productRoutes);

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

