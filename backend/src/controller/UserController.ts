
// models
import models from "../database/relations";
import connection from "../database/connection/connection";
import { Op } from "sequelize";

// security
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

// dotenv
import dotenv from 'dotenv';
dotenv.config();
const secretToken = process.env.SECRET_TOKEN;
if (!secretToken){ // force verification
    throw new Error('SECRET_TOKEN not defined in .env');
}

// express
import { Request, Response } from 'express';


// user register request
interface UserRegisterRequest{
    name: string; 
    email: string; 
    password: string;
};

// user login request
interface UserLoginRequest{
    email: string;
    password: string;
};

// user respose
interface UserResponse{
    id: string;
    name: string;
};

interface ApiResponse<T = any>{
    success: boolean; 
    message: string; 
    data?: T; 
    errorMessage?: string;
};


// class
class UserController{
    // get error message
    getErrorMessage(error: unknown): string {
        if(error instanceof Error) return error.message;
        return String(error);
        // if "error" its a instance from Error, we can access his properties, like "error.message" with safety
    };


    // register
    async registerUser(
        req: Request< {}, {}, UserRegisterRequest >, // express.Request<Params, ResBody, ReqBody, Query>
        res: Response< ApiResponse<UserResponse> > // complete response always follow "ApiResponse" interface, but "data" can be UserResponse types
    ){
        const { name, email, password } = req.body;
        if(!name || !email || !password){
            return res.status(400).send({
                success: true,
                message: 'Bad request at fields sended'
            });
        }

        try{
            // bcrypt - hash
            let hash = bcrypt.hashSync(password, 10);

            // email exist verify
            const email_exist = await models.User.findOne({
                where: { email }
            });
            if(email_exist){
                return res.status(409).send({ 
                    success: false,
                    message: 'User Email already exist' 
                });
            };

            // profile save
            const newUser = await models.User.create({ name, email, password: hash });
            if(!newUser){
                return res.status(500).send({
                    success: false,
                    message: 'Error at user creation at database'
                });
            }

            console.log('_____________________');
            console.log('User creation success');
            console.log('_____________________');
            return res.status(201).send({
                success: true,
                message: 'User creation success',
                data: { id: newUser.id, name: newUser.name }
            });
        }
        catch(error: unknown){
            console.error('Internal server error at User Register', error);
            return res.status(500).send({
                success: false,
                message: 'Internal server error at User Register',
                errorMessage: this.getErrorMessage(error)
            });
        }
    };


    // login
    async login(
        req: Request<{}, {}, UserLoginRequest>,
        res: Response< ApiResponse<UserResponse> >
    ){
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).send({
                success: true,
                message: 'Bad request at fields sended'
            });
        }

        try{
            // user existence check
            const user_exist = await models.User.findOne({
                where: { email }
            });
            if(!user_exist){
                return res.status(404).send({
                    success: false,
                    message: 'User email data not found'
                });
            }

            // user password comparation
            const password_comparation = await bcrypt.compare(password, user_exist.password);
            if(!password_comparation){
                return res.status(401).send({
                    success: false,
                    message: 'Incorrect user password'
                });                
            }

            // token sign
            let tokenVar = jwt.sign({
                id: user_exist.id,
                name: user_exist.name,
                email: user_exist.email,
                iat: Math.floor(Date.now() / 1000), // creation data (seconds)
                exp: Math.floor(Date.now() / 1000) + (10 * 24 * 60 * 60) // 10 days (seconds)
            }, secretToken as string); // "as string" - type assertion

            // cookie save
            res.cookie('token', tokenVar,{
                httpOnly: true, // preventing access via JavaScript, avoiding XSS, (only server)
                sameSite: 'strict', // protects against CSRF
                maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days                
            });

            console.log('_____________________');
            console.log('User login success');
            console.log('_____________________');
            return res.status(200).send({
                success: true,
                message: 'User login success',
                data: { id: user_exist.id, name: user_exist.name }
            });
        }
        catch(error: unknown){
            console.error('Internal server error at User Login: ', error);
            return res.status(500).send({
                success: false,
                message: 'Internal server error at User Login',
                errorMessage: this.getErrorMessage(error)
            });
        }
    };

    
    // get user data
    async getUser(
        req: Request,
        res: Response< ApiResponse<UserResponse> >
    ){
        try{
            // get token
            const token = req.cookies.token;
            if(!token){
                return res.status(401).json({
                    success: false,
                    message: 'token not found'
                });
            }

            // decodefying token
            const decoded = jwt.verify(token, secretToken as string) as {
                id: string;
                name: string;
                email: string;
                iat: number;
                exp: number;
            };

            // get user
            const user = await models.User.findOne({
                where: { id: decoded.id },
                attributes: [ 'id', 'name' ]
            });
            if(!user){
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            return res.status(200).send({
                success: true,
                message: 'Get user data success',
                data: { id: user.id, name: user.name }
            });
        }
        catch(error: unknown){
            console.error('Internal server error at Get user data: ', error);
            return res.status(500).send({
                success: false,
                message: 'Internal server error at Get user data',
                errorMessage: this.getErrorMessage(error)
            });
        }
    };
};


export default new UserController();