import jwt from 'jsonwebtoken'


//create jwt token
export const createToken = (payload, exp ) => {
    //create new token
    const token = jwt.sign(payload, process.env.JWT_SREATE,{
        expiresIn : exp
    })

    return token;

}


/**
 * jwt verify
 */

export const tokenVerify = (token) =>{
    return jwt.verify(token, process.env.JWT_SREATE)
}