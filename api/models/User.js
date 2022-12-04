import mongoose from "mongoose";


//create student scema
const UserSchema = new mongoose.Schema({
    first_name : {
        type : String,
        required : true,
        trim : true
    },
    sur_name : {
        type : String,
        required : true,
        trim : true
    },
    username : {
        type : String,
        trim : true,
        default : ''
    },
    secondary_name : {
        type : String,
        trim : true,
        default : ''
    },
    email : {
        type : String,
        trim : true,
    },
    mobile : {
        type : String,
        trim : true,
    },
    password : {
        type : String,
        required : true,
        trim : true
    },
    gender  : {
        type : String
    },
   birth_date  : {
        type : String,
        required : true
    },
   birth_month  : {
        type : String,
        required : true
    },
   birth_year  : {
        type : String,
        required : true
    },
    profile_photo: {
        type : String,
        default : null
    },
  cover_photo: {
        type : String,
        default : null
    },
    bio: {
        type : String,
        default : null
    },
    work : {
        type : Array,
        default : []
    },
    edu : {
        type : Array,
        default : []
    },
    living : {
        type : String
    },
    home_town : {
        type : String
    },
    relationship : {
        type : String,
        enum : ['Married', 'UnMarried', 'Singile', 'In a Relation ship']
    },
    joined : {
        type : Date
    },
    social : {
        type : Array,
        default : []
    },
    friend : {
        type : Array,
        default : []
    },
    following : {
        type : Array,
        default : []
    },
   follower : {
        type : Array,
        default : []
    },
    request : {
        type : Array,
        default : []
    },
    block : {
        type : Array,
        default : []
    },
    post : {
        type : Array,
        default : []
    },
    isAdmin :  {
        type : Boolean,
        default : false
    },
    isActivate :  {
        type : Boolean,
        default : false
    },
    isVerified :  {
        type : Boolean,
        default : false
    },
    access_token :  {
        type : String,
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
export default mongoose.model('User',  UserSchema)