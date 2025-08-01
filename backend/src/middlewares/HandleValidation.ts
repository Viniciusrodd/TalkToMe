
// libs
import { validationResult } from "express-validator";

// express
import { Request, Response, NextFunction } from "express";

// middleware
const validate = (req: Request, res: Response, next: NextFunction): Response | void =>{
    const errors = validationResult(req);

    // without errors:
    if(errors.isEmpty()) return next();

    // with errors:
    const extractedErrors: Array<String> = [];
    errors.array().map((err) => extractedErrors.push(err.msg));
    return res.status(422).json({ errors: extractedErrors });
};

// export
export default validate;