
// libs
import { body, ValidationChain } from "express-validator";

//// validations

// register
const user_register_validation = (): ValidationChain[] =>{
    return [
        // invalid name
        body('name')
            .isString().withMessage('name is required')
            .isLength({ min: 4 }).withMessage('name requires at least 4 characteres')
            .trim(),

        // invalid email
        body('email')
            .isString().withMessage('email is required')
            .isEmail().withMessage('insert a valid email')
            .normalizeEmail(),
    
        // invalid password
        body('password')
            .isString().withMessage('password is required')
            .isLength({ min: 5 }).withMessage('password requires at least 5 characteres')
            .escape(), // "escape()" prevents from XSS
    ];
};


// export
const validations = {
    user_register_validation
};
export default validations;