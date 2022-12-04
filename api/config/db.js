
import mongoose from "mongoose";

export const mongoDBConnect = async () => {

try {

    const connect = await mongoose.connect('mongodb://127.0.0.1/delouar')
    console.log(`mongodb server is connected`.bgYellow);
    
} catch (error) {
    console.log(error.message);
}

}

