
// express
import { strict } from "assert";
import { Response } from "express";


// logout function
export const logOutService = (res: Response) =>{
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'strict'
    });
};