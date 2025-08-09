
// libs
import axios, { type AxiosResponse } from 'axios';

// user register interface
interface IUserRegister{
    name: string,
    email: string,
    password: string
};

// user login interface
interface IUserLogin{
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
export const user_register = async (userData: IUserRegister): Promise< AxiosResponse<ApiResponse> > =>{
    try{
        const response = await axios.post('http://localhost:2140/register', userData);
        return response;
    }
    catch(error){
        if(axios.isAxiosError(error)){
            const errorMessage = error.response?.data?.errors?.[0] || error.response?.data?.message || error.message;
            console.error('user registration failed: ', error.response?.data?.errors?.[0] || error.response?.data?.message); 
            
            // repass the error for component
            throw new Error(errorMessage);
        }
        throw new Error('unknown user registration fail');
    }
};


// user login
export const user_login = async (userData: IUserLogin): Promise< AxiosResponse<ApiResponse> > =>{
    try{
        const response = await axios.post('http://localhost:2140/login', userData, { withCredentials: true });        
        return response;
    }
    catch(error){
        if(axios.isAxiosError(error)){
            const errorMessage = error.response?.data?.errors?.[0] || error.response?.data?.message || error.message;
            console.error('user login failed: ', error.response?.data?.errors?.[0] || error.response?.data?.message); 
            
            // repass the error for component
            throw new Error(errorMessage);
        }

        throw new Error('unknown user login fail');      
    }
};