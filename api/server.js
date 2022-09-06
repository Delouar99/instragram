import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import StudentRoute from './routes/Student.js'
import userRoute from './routes/user.js'
import mongoDBConerct from './config/db.js';
import ErrorHandaler from './middwalers/ErrorHandaler.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'

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
app.use('/api/student', StudentRoute)
app.use('/api/user', userRoute)

//express error handler
app.use(ErrorHandaler)


//lisent server
app.listen(PORT, () => {
    mongoDBConerct();
    console.log(`server is running on port ${PORT}`.bgGreen.black);
});