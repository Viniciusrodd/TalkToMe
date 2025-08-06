
// libs
import { body, ValidationChain } from "express-validator";

//// validations

// register
const user_register_validation = (): ValidationChain[] =>{
    return [
        // invalid name
        body('name')
            .isString().withMessage('Name is required')
            .isLength({ min: 4 }).withMessage('Name requires at least 4 characteres')
            .trim(),

        // invalid email
        body('email')
            .isString().withMessage('Email is required')
            .isEmail().withMessage('Insert a valid email')
            .normalizeEmail(),
    
        // invalid password
        body('password')
            .isString().withMessage('Password is required')
            .isLength({ min: 5 }).withMessage('Password requires at least 5 characteres')
            .escape(), // "escape()" prevents from XSS
    ];
};


// login validation
const user_login_validation = (): ValidationChain[] =>{
    return [
        // email require
        body('email')
            .isString().withMessage('Email is required')
            .isEmail().withMessage('Insert a valid email'),

        // password require
        body('password')
            .isString().withMessage('Password is required')
    ];
};


// export
const validations = {
    user_register_validation,
    user_login_validation
};
export default validations;