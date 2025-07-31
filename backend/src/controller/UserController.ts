
// models
import models from "../database/relations";
import connection from "../database/connection/connection";
import { Op } from "sequelize";

// security
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

// express
import { Request, Response } from 'express';


// user request
interface UserRegistrationRequest{
    name: string; email: string; password: string;
};

// user respose
interface UserResponse{
    name: string;
};

interface ApiResponse<T = any>{
    success: boolean; message: string; data?: T; errorMessage?: string;
};


// class
class UserController{

    // get error message
    getErrorMessage(error: unknown): string {
        if(error instanceof Error) return error.message;
        return String(error);
        // if "error" its a instance from Error, we can access his properties, like "error.message" with safety
    };

    // register user
    async registerUser(
        req: Request< {}, {}, UserRegistrationRequest >, // express.Request<Params, ResBody, ReqBody, Query>
        res: Response< ApiResponse <UserResponse> > // complete response always follow "ApiResponse" interface, but "data" can be UserResponse types
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
                data: { name: newUser.name }
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

};


export default new UserController();