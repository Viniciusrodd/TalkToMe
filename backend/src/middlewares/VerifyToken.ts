// libs
import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { JwtPayload, VerifyErrors } from 'jsonwebtoken';

// express
import { Request, Response, NextFunction } from 'express';

// dotenv
dotenv.config();
const secretToken = process.env.SECRET_TOKEN;
if (!secretToken){ // force verification
    throw new Error('SECRET_TOKEN not defined in .env');
}

// middleware
const verifyToken = (req: Request, res: Response, next: NextFunction): void | Response =>{
    const token = req.cookies?.token || (req.headers['authorization']?.split(' ')[1]);
    if(!token){
        return res.status(401).json({
            errorVerify: 'User not authenticated'
        });
    }

    // verify
    jwt.verify(token, secretToken, (err: VerifyErrors | null, data: string | JwtPayload | undefined) =>{
        if(err){
            console.log('JWT verification failed: ', err);
            return res.status(403).json({ invalidToken: 'Invalid token' });
        }

        /* add user data at request
        req.user = data;
        */
        next();
    });
};

export default verifyToken;