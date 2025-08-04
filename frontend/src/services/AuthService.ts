
// libs
import axios, { type AxiosResponse } from 'axios';

// user register interface
interface IUserRegister{
    name: string,
    email: string,
    password: string
};

// api response interface
interface ApiResponse{
    success: boolean; 
    message: string; 
    data?: { name: string; }; 
    error?: string;
};


//// services


// user - register
export const user_register = async (userData: IUserRegister): Promise<AxiosResponse<ApiResponse>> =>{
    try{
        const response = await axios.post('http://localhost:2140/register', userData);
        return response;
    }
    catch(error){
        if(axios.isAxiosError(error)){
            console.error('user registration failed: ', error.response?.data);
            throw error;
        }
        throw new Error('unknown user registration fail');
    }
};