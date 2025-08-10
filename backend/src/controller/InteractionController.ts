
// models
import models from "../database/relations";
import connection from "../database/connection/connection";
import { Op } from "sequelize";

// express
import { Request, Response } from 'express';

// api response
interface ApiResponse<T = any>{
    success: boolean; 
    message: string; 
    data?: T; 
    errorMessage?: string;
};


// class
class InteractionController{
    // get error message
    getErrorMessage(error: unknown): string {
        if(error instanceof Error) return error.message;
        return String(error);
        // if "error" its a instance from Error, we can access his properties, like "error.message" with safety
    };


    
};


export default new InteractionController();