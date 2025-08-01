// modules
import express from 'express';
const router = express.Router();

// controllers
import UserController from '../controller/UserController';

// handle validation - middleware
import validate from '../middlewares/HandleValidation';
import validations from '../middlewares/ControllerValidations/UserValidations';

//// routes

// user - backend port: 2140
router.post('/register', validate, validations.user_register_validation, UserController.registerUser);



// export
export default router; 