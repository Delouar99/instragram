
import jwt from 'jsonwebtoken'

//create jwt token
export const CreateToken = (data, expire = '7d') =>{
return jwt.sign(data, process.env.JWT_SREATE,{
    expiresIn : expire
})
}

