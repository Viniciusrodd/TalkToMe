
// models
import models from "../database/relations";
import connection from "../database/connection/connection";
import { Op } from "sequelize";

// security
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

// express
import { Request, Response } from 'express';


//// user types

// user request
interface UserRegistrationRequest{
    name: string; email: string; password: string;
};

// user respose
interface UserRegistrationResponse{
    id: string; name: string; email: string;
};

interface ApiResponse<T = any>{
    success: boolean; message: string; data?: T; error?: string;
};


// class
class UserController{

    // register user
    registerUser(
        req: Request< {}, {}, UserRegistrationRequest >, 
        res: Response< ApiResponse <UserRegistrationResponse> >
    ){
        const { name, email, password } = req.body;
        
    };

};


export default new UserController();