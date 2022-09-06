import express from 'express';
import { CreateUser, DeleteUser, getAllUser, getLoggedInUser, getSingleUser, recoverpassword, UpdateUser, useRegister, userLogin, verifyUserAccount } from '../controllers/userControler.js';
import { adminMiddlware } from '../middwalers/adminMiddlware.js';
import { authMIddleware } from '../middwalers/authMiddleware.js';
import { userMiddware } from '../middwalers/userMiddware.js';




//init router
const router = express.Router();


//user auth route
router.post('/login', userLogin);
router.post('/register', useRegister);
router.get('/me', getLoggedInUser);
router.post('/verify', verifyUserAccount);
router.post('/recoverpassword', recoverpassword);




//route user api
router.route('/').get(adminMiddlware, getAllUser).post(authMIddleware, CreateUser)
router.route('/:id').get(userMiddware, getSingleUser).put(userMiddware, UpdateUser).patch( userMiddware, UpdateUser).delete(userMiddware, DeleteUser)





//export default
export default router;