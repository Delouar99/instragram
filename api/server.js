import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import path from 'path'
import ErrorHandaler from './middwalers/ErrorHandaler.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { mongoDBConnect } from './config/db.js';
import userRoute from './routes/user.js'




//init express
const app = express()
dotenv.config();


//middlewares
app.use(express.json());
app.use(express.urlencoded({extended : false}))
app.use(cookieParser());
app.use(cors());


//indt env varbale
const PORT = process.env.SERVER_PORT || 5000;



//routes
app.use('/api/v1/user', userRoute)



//static folder
app.use(express.static('api/publice'))




//express error handler
app.use(ErrorHandaler)


//lisent server
app.listen(PORT, () => {
    mongoDBConnect()
    console.log(`server is running on port ${PORT}`.bgGreen.black);
});