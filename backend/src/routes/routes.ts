// modules
import express from 'express';
const router = express.Router();

// controllers
import UserController from '../controller/UserController';

// handle validation - middleware
import validate from '../middlewares/HandleValidation';


// user - backend port: 2140
router.post('/register', validate, UserController.registerUser);


export default router; 