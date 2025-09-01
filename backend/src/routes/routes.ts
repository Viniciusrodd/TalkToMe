// express
import { Request, Response, Router } from 'express';
const router = Router();

// controllers
import UserController from '../controller/UserController';
import InteractionController from '../controller/InteractionController';

// handle validation - middleware
import validate from '../middlewares/HandleValidation';
import validations from '../middlewares/ControllerValidations/UserValidations';
import verifyToken from '../middlewares/VerifyToken';

// verify token middleware
router.get('/verifyToken', verifyToken, (req: Request, res: Response) =>{
    return res.status(200).send({ 
        message: 'token is valid'
    });
});


//// routes


// user - backend port: 2140
router.post('/register', validations.user_register_validation(), validate, UserController.registerUser);
router.post('/login', validations.user_login_validation(), validate, UserController.login);
router.get('/user', verifyToken, UserController.getUser);
router.get('/logOut', verifyToken, UserController.logOut);


// interections - backend port: 2140
router.post('/chatInterection', verifyToken, InteractionController.chatInteraction);
router.get('/conversations/:userID', verifyToken, InteractionController.getConversations);
router.get('/conversation/:userID/:title', verifyToken, InteractionController.searchConversation);
router.delete('/conversation/:conversationID', verifyToken, InteractionController.deleteChat);


// export
export default router; 