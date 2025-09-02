
// libs
import axios, { type AxiosResponse } from 'axios';

// chat interaction request
interface IchatRequestData{
    text: string;
    userId: string;
    sender: string;
    conversationId: string | null;
    file: {
        name: string;
        type: string;
        size: number;
        content: string | null;
    } | null;
};

// api response interface
interface ApiResponse{
    success: boolean; 
    message: string; 
    data?: { llm_result: string; title: string; conversationId: string | null; }; 
    error?: string;
};

// search response
interface SearchResponse{
    success: boolean; 
    message: string; 
    data?: { 
        conversationId: string;
        title: string;
        conversationCreatedAt: Date;
        messages: {
            messageId: string;
            sender: string;
            content: string;
        }[];
    }[]; 
    error?: string;
}


//// services


// get llm response + chat title
export const chat_interaction = async (data: IchatRequestData): Promise<AxiosResponse<ApiResponse>> =>{
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


// search for chat
export const search_chat_service = async (userID: string, title: string): Promise<AxiosResponse<SearchResponse>> => {
    try{
        const response = await axios.get(
            `http://localhost:2140/conversation/${userID}/${title}`,
            { withCredentials: true }
        );
        return response;      
    }
    catch(error){
        if(axios.isAxiosError(error)){
            const errorMessage = error.response?.data?.message || error.message;
            console.error('search chat failed: ', errorMessage);

            // repass the error for component
            throw new Error(errorMessage);   
        }
        throw new Error('unknown search chat fail');
    }
};


// delete chat
export const delete_chat = async (conversationID: string): Promise<AxiosResponse<ApiResponse>> =>{
    try{
        const response = await axios.delete(
            `http://localhost:2140/conversation/${conversationID}`, 
            { withCredentials: true }
        );
        return response;
    }
    catch(error){
        if(axios.isAxiosError(error)){
            const errorMessage = error.response?.data?.message || error.message;
            console.error('chat delete failed: ', errorMessage);

            // repass the error for component
            throw new Error(errorMessage);   
        }
        throw new Error('unknown delete chat fail');
    }
};