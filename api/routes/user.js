import express from 'express';
import { loggedinUser, login, register, acctivateAccount, acctivateAccountBycode, forgotPassword, forgotPasswordAction, ForgotacctivateAccountBycode, resendActivation } from '../controllers/userControler.js';




//init router
const router = express.Router();


//user auth route
router.post('/register', register)
router.post('/login', login)
router.get('/me', loggedinUser)
router.get('/activate/:token', acctivateAccount)
router.post('/code-activation', acctivateAccountBycode)
router.post('/resend-Link', resendActivation)
router.post('/forgot-password', forgotPassword)
router.post('/forgot-password/:token', forgotPasswordAction)
router.post('/Forgotcode-activation', ForgotacctivateAccountBycode)



//export default
export default router;