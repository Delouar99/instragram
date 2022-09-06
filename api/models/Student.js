import mongoose from "mongoose";


//create student scema
const studentSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        trim : true,
        unique : true
    },
    cell : {
        type : String,
        required : true,
        trim : true,
        unique : true
    },
    username : {
        type : String,
        required : true,
        trim : true,
        unique : true
    },
    age  : {
        type : Number,
        required : true,
    },
    gander  : {
        type : String
    },
   password : {
        type : String,
        required : true,
        trim : true
    },
   photo: {
        type : String,
       
    },
    isAdmin :  {
        type : Boolean,
        default : false
    },
    
    status :  {
        type : Boolean,
        default : true
    },
    trash  :  {
        type : Boolean,
        default : false
    },
    

}, {
    timestamps : true,
    versionKey : false
});







//export model
export default mongoose.model('Student',  studentSchema)