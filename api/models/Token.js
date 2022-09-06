import mongoose from "mongoose";


//create student scema
const tokenSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    token : {
        type : String,
        required : true
    }
}, {
    timestamps : true
    
});







//export model
export default mongoose.model('Token',  tokenSchema)