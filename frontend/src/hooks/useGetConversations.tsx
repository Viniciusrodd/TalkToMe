
// libs
import axios, { AxiosError } from 'axios';

// hooks
import { useState, useEffect, useContext } from 'react';

// context
import { LoadingContext } from '../context/LoadingContext';


// api response interface
interface iGetConversations{
    conversationId: string;
    title: string;
    conversationCreatedAt: Date;
    messages: {
        messageId: string;
        sender: string;
        content: string;
    }[];
}

// api response
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}


// use get conversations
export const getConversations = (userID: string) =>{
    // states
    const [ conversations, setConversations ] = useState<iGetConversations[]>([]);
    const [ errorResConv, setErrorResConv ] = useState<string | null>(null);

    // consts
    const { setLoading } = useContext(LoadingContext);

    // functions
    useEffect(() =>{
        if(userID !== ''){
            const request = async (): Promise<void> => {
                setLoading(true);
                try{
                    const res = await axios.get<ApiResponse<iGetConversations[]>>(
                        `http://localhost:2140/conversations/${userID}`,
                        { withCredentials: true }
                    );
                    if(res.data.success && res.data.data){
                        setConversations(res.data.data);
                        setLoading(false);
                    }
                }
                catch(error){
                    if(error instanceof AxiosError){
                        const errorMessage = error.response?.data?.error 
                        || error.response?.data?.message 
                        || error.message 
                        || 'Unknown error during get conversations';
                        
                        setErrorResConv(errorMessage);
                        console.error('Get conversations failed:', errorMessage);
                    }
                }
            }
            request();
        }
    }, [userID]);


    return { conversations, errorResConv };
};