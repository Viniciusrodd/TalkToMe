
// libs
import axios, { AxiosError } from 'axios';

// hooks
import { useState, useEffect } from 'react';

// api response interface
interface iVerifyTokenResponse{
    message?: string;
}


// use verify token
export const verifyToken = () =>{
    // states
    const [ status, setStatus ] = useState<string>('');
    const [ errorRes, setErrorRes ] = useState<string | null>(null);


    useEffect(() =>{
        const request = async (): Promise<void> =>{
            try{
                const res = await axios.get<iVerifyTokenResponse>(
                    'http://localhost:2140/verifyToken',
                    { withCredentials: true }
                );
                if(res.status === 200){
                    setStatus('ok');
                }
            }
            catch(error){
                if(error instanceof AxiosError){
                    const errorMessage = error.response?.data?.error 
                    || error.response?.data?.message 
                    || error.message 
                    || 'Unknown error during token verification';
                    
                    setErrorRes(errorMessage);
                    console.error('Token verification failed:', errorMessage);
                }
            }
        };

        request();
    }, []);


    return { status, errorRes };
};