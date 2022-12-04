import bcrypt from 'bcryptjs'

//careate a hash password

export const hashPassword = (password) => {

    //slat gen
    const salt = bcrypt.genSaltSync(12);
    const hashpass = bcrypt.hashSync(password, salt);
    return hashpass;
}

//password match

export const passwordVerify = (password, hash) => {

    return bcrypt.compareSync(password, hash);
}