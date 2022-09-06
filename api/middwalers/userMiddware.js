import createError from "../controllers/ErrorControler.js";
import  Jwt  from "jsonwebtoken";

//check user authenticated or not
export const userMiddware = (req, res, next) =>{


  try {
    const token = req.cookies.access_token;

    //chekc token
    if(!token){
        return next(createError(401, "you are not Authenticated"))
    }

    //if logged in
    const login_user = Jwt.verify(token, process.env.JWT_SREATE);

    if(!login_user){
        return next(createError(401, "Invalid token"))
    }

    
    if(login_user.id === req.params.id){
        return next(createError(401, "your are not reable exces this feture "))
    }

    if(login_user){
        req.user = login_user;
        next();
    }


  } catch (error) {
    next(error)
  }

}