
// libs
import axios, { AxiosError } from 'axios';

// hooks
import { useState, useEffect } from 'react';


// user interface
interface iUser{
    id: number;
    name: string;
    email: string;
}

// api response interface
interface iVerifyTokenResponse{
    user?: iUser;
    message?: string;
}


// use verify token
export const useVerifyToken = () =>{
    // states
    const [ userData, setUserData ] = useState<iUser | null>(null);
    const [ errorRes, setErrorRes ] = useState<string | null>(null);


    useEffect(() =>{
        const verifyToken = async (): Promise<void> =>{
            try{
                const { data } = await axios.get<iVerifyTokenResponse>(
                    'http://localhost:2140/verifyToken',
                    { withCredentials: true }
                );

                // check user data
                data.user ? setUserData(data.user) : setErrorRes('User data not found in response');
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

        verifyToken();
    }, []);


    return { userData, errorRes };
};