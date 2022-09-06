

import bcrypt from 'bcryptjs'
import User from '../models/User.js';
import Token from '../models/Token.js';
import createError from "./ErrorControler.js";
import Jwt from 'jsonwebtoken';
import { SendEmail } from '../utility/SendEmail.js';
import { Sendsms } from '../utility/Sendsms.js';
import { CreateToken } from '../utility/Createtoken.js';

/**
 * @access public
 * @route /api/user
 * @mehtod GET
 */



export const getAllUser = async  (req, res, next) =>{
   

    try {
      const users = await User.find();
        res.status(200).json(users);

    } catch (error) {
       
      next(error);
    }

}



/**
 * @access public
 * @route /api/user:id
 * @mehtod Post
 */

 export const getSingleUser = async (req, res, next) =>{

    const {id} = req.params;
    try {
        const user = await User.findById(id);
         

          if(!user){
            return next(createError(404, "single user not found"))
          }

          if(user){
            res.status(200).json(user);
            
          }

  
      } catch (error) {
          next(error)
      }

}




/**
 * @access public
 * @route /api/user
 * @mehtod Post
 */

export const CreateUser = async (req, res, next) =>{

    //make hash password
    const salt = await bcrypt.genSalt(10);
    const hash_pass = await bcrypt.hash(req.body.password, salt)
    
    try {
        const user = await User.create({...req.body, password : hash_pass});
          res.status(200).json(user);

      } catch (error) {
          next(error);
      }
}





/**
 * @access public
 * @route /api/user:id
 * @mehtod put/patch
 */

 export const UpdateUser = async (req, res, next) =>{
    const {id} = req.params;
    try {
        const user = await User.findByIdAndUpdate(id, req.body, {new : true});
          res.status(200).json(user);
  
      } catch (error) {
          next(error)
      }
}


/**
 * @access public
 * @route /api/user:id
 * @mehtod delete
 */

 export const DeleteUser = async (req, res) =>{
    const {id} = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
          res.status(200).json(user);
  
      } catch (error) {
          console.log(error);
      }
}



//auth register work


/**
 * @access public
 * @route /api/user/login
 * @mehtod Post
 */

 export const userLogin = async (req, res, next) =>{

    
    
    
    try {
        //find user
        const login_user = await User.findOne({email : req.body.email})

        //check user
        if(!login_user){
            return next(createError(404, "user not found"))
        }

        const passwordcheck = await bcrypt.compare(req.body.password, login_user.password);

        //check password
        if(!passwordcheck){
            return next(createError(404, "user not password"))
        }


        //create a tokent.....................
        const tokent = Jwt.sign({id : login_user._id, isAdmin : login_user.isAdmin}, process.env.JWT_SREATE );

        //login user info..........
        const {password, isAdmin, ...login_info} = login_user._doc;

        res.cookie("access_token", tokent).status(200).json({
            token : tokent,
            User : login_info,
            
        })

    } catch (error) {
       next(error) 
    }
}


//user register


/**
 * @access public
 * @route /api/user/register
 * @mehtod Post
 */

 export const useRegister = async (req, res, next) =>{

    //make hash password
    const salt = await bcrypt.genSalt(10);
    const hash_pass = await bcrypt.hash(req.body.password, salt)
    
    try {
        //user data send
        const user = await User.create({...req.body, password : hash_pass});

        //create token..............
        const token = CreateToken({ id : user._id })

        //update token
        await Token.create({userId : user._id, token : token})

    
        //send acctivation mail
        const veriry_link = `http://localhost:3000/user/${user._id}/verify/${token}`;
        SendEmail(user.email, 'verify account', veriry_link)

        res.status(200).json(user);

      } catch (error) {
          next(error);
      }
}



/**
 * @access public
 * @route /api/me
 * @mehtod get
 */


export const getLoggedInUser = async (req, res, next) =>{
  
    try {
        //get token
        const bearer_token = req.headers.authorization;

        let token = ''
        if(bearer_token){
            token = bearer_token.split(' ')[1];

            //get token user
            const logged_in_user = Jwt.verify(token, process.env.JWT_SREATE);
            
            //user check
            if( !logged_in_user ){
                next(createError(401, 'invalid token'))
            }

            //user check

            if(logged_in_user){
                const user = await User.findById(logged_in_user.id)
                res.status(200).json(user)
            }



        }

        
        //check token exit
        if(!bearer_token){
            next(createError(400, 'token not found'))
        }



        
    } catch (error) {
        next(error)
    }
    


}




//verify user account
 
export const verifyUserAccount = async (req, res, next) => {

    try {

      const { id, token} = req.body;
        
      //create token
    const verify = await Token.findOne({id : id, token : token});
   

    //not verify
    if(!verify){
        next(createError(400, 'invilad verify data'))
    }

    //verify
    if(verify){
        await User.findByIdAndUpdate(id, {
            isVerified : true
        })

        res.status(200).json({message : "Your account is verified"});
        verify.remove();
        
    }
        
    } catch (error) {
        next(createError(404, 'verify faild'))
    }
}




//recover password

export const recoverpassword = async(req, res,next) => {

    try {

        //get email
        const {email} = req-body;

        //check email
        const recover_user = await User.findOne({email});

        if(!recover_user){
           res.status(404).json({
            message : "password dose not match"
           })
        }

        if(recover_user){
           
            const token = CreateToken({id : recover_user._id}) 

            const recovery_url = `http://localhost:3000/password-recover/${token}`

            await Token.create({
                userId : recover_user._id,
                token : token
            })
            SendEmail(recover_user.email, 'password reset', recovery_url )

            res.status(200).json({
                message : "password recover link send"
            })

        }

     



        
    } catch (error) {
        next(error)
    }
}