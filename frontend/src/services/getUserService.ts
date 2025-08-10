
// libs
import axios, { type AxiosResponse } from 'axios';

// api response interface
interface ApiResponse{
    success: boolean; 
    message: string; 
    data?: { id: string; name: string; }; 
    error?: string;
};


//// services


export const get_user_data = async (): Promise< AxiosResponse<ApiResponse> > =>{
    try{
        const response = await axios.get('http://localhost:2140/user', { withCredentials: true });
        return response;
    }
    catch(error){
        if(axios.isAxiosError(error)){
            const errorMessage = error.response?.data?.message || error.message;
            console.error('get user data failed: ', errorMessage);

            // repass the error for component
            throw new Error(errorMessage);   
        }
        throw new Error('unknown get user data fail');
    }
};