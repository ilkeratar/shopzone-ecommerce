import express from 'express';
import dotenv from 'dotenv';
const app = express();
import productRoutes from './routes/products.js';
import {connectDatabase} from "./config/dbConnect.js";

dotenv.config({path:'backend/config/config.env'});

connectDatabase();

app.use('/api',productRoutes);

app.listen(process.env.PORT,()=>{
    console.log(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
})

