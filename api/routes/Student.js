import express from 'express';
import { CreateStudent, DeleteStudent, getAllStudent, getSingleStudent, UpdateStudent } from '../controllers/StudentControler.js';
import { authMIddleware } from '../middwalers/authMiddleware.js';



//init router
const router = express.Router();

//router
router.route('/').get(authMIddleware, getAllStudent).post(authMIddleware, CreateStudent)
router.route('/:id').get(authMIddleware, getSingleStudent).put( authMIddleware, UpdateStudent).patch(authMIddleware, UpdateStudent).delete(authMIddleware, DeleteStudent)




//export default
export default router;