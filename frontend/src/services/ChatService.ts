
// libs
import axios, { type AxiosResponse } from 'axios';

// chat interaction request
interface IchatRequestData{
    text: string;
    userId: string;
    sender: string;
};

// api response interface
interface ApiResponse{
    success: boolean; 
    message: string; 
    data?: { llm_result: string; title: string; }; 
    error?: string;
};


//// services


// get llm response + chat title
export const chat_interaction = async (data: IchatRequestData): Promise< AxiosResponse<ApiResponse> > =>{
    try{
        const response = await axios.post(
            'http://localhost:2140/chatInterection', 
            data, { withCredentials: true }
        );
        return response;
    }
    catch(error){
        if(axios.isAxiosError(error)){
            const errorMessage = error.response?.data?.message || error.message;
            console.error('chat interaction failed: ', errorMessage);

            // repass the error for component
            throw new Error(errorMessage);   
        }
        throw new Error('unknown chat interaction fail');
    }
};