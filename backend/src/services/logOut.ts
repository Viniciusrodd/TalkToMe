
// express
import { strict } from "assert";
import { Response } from "express";


// logout function
export const logOutService = async (res: Response) =>{
    return res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'strict'
    });
};