
import mongoose from "mongoose";

//create a mongodb connection
const mongoDBConerct = async () =>{
try {
    
    await mongoose.connect(process.env.MONGO_STRING);
    console.log(`mongo DB connected sucesfully`.bgYellow.black);

} catch (error) {
console.log(error);
    
}
    
}

export default mongoDBConerct;