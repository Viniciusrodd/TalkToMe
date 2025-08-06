// modules
import express from 'express';
const router = express.Router();

// controllers
import UserController from '../controller/UserController';

// handle validation - middleware
import validate from '../middlewares/HandleValidation';
import validations from '../middlewares/ControllerValidations/UserValidations';
import verifyToken from '../middlewares/VerifyToken';

//// routes

// user - backend port: 2140
router.post('/register', validations.user_register_validation(), validate, UserController.registerUser);
router.post('/login', validations.user_login_validation(), validate, UserController.login);


// export
export default router; 