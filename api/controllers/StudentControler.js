
import Student from "../models/Student.js"
import bcrypt from 'bcryptjs'
import createError from "./ErrorControler.js";


/**
 * @access public
 * @route /api/student
 * @mehtod GET
 */



export const getAllStudent = async  (req, res, next) =>{
   

    try {
      const students = await Student.find();
        res.status(200).json(students);

    } catch (error) {
       
      next(error);
    }

}



/**
 * @access public
 * @route /api/student:id
 * @mehtod Post
 */

 export const getSingleStudent = async (req, res, next) =>{

    const {id} = req.params;
    try {
        const student = await Student.findById(id);
         

          if(!Student){
            return next(createError(404, "single user not found"))
          }

          if(Student){
            res.status(200).json(student);
            
          }

  
      } catch (error) {
          next(error)
      }

}




/**
 * @access public
 * @route /api/student
 * @mehtod Post
 */

export const CreateStudent = async (req, res, next) =>{

    //make hash password
    const salt = await bcrypt.genSalt(10);
    const hash_pass = await bcrypt.hash(req.body.password, salt)
    
    try {
        const student = await Student.create({...req.body, password : hash_pass});
          res.status(200).json(student);

      } catch (error) {
          next(error);
      }
}





/**
 * @access public
 * @route /api/student:id
 * @mehtod put/patch
 */

 export const UpdateStudent = async (req, res, next) =>{
    const {id} = req.params;
    try {
        const student = await Student.findByIdAndUpdate(id, req.body, {new : true});
          res.status(200).json(student);
  
      } catch (error) {
          next(error)
      }
}


/**
 * @access public
 * @route /api/student:id
 * @mehtod delete
 */

 export const DeleteStudent = async (req, res) =>{
    const {id} = req.params;
    try {
        const student = await Student.findByIdAndDelete(id);
          res.status(200).json(student);
  
      } catch (error) {
          console.log(error);
      }
}