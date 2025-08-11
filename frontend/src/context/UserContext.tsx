
// hooks
import { createContext, useState } from "react";
import type { ReactNode } from "react"; // specific imports for types

// user context type
type UserContextType = {
    userId: string,
    setUserId: (id: string) => void,
    userName: string,
    setUserName: (name: string) => void;
};

// props provider
type UserPropsProvider = {
    children: ReactNode;
};

// export context
export const UserContext = createContext<UserContextType>({
    userId: '',
    setUserId: () => {},
    userName: '',
    setUserName: () => {}
});


// provider
export const UserProvider = ({ children }: UserPropsProvider) =>{
    // states
    const [ userName, setUserName ] = useState<string>('');
    const [ userId, setUserId ] = useState<string>('');

    return(
        <UserContext.Provider value={{ userName, setUserName, userId, setUserId }}>
            { children }
        </UserContext.Provider>
    );
};  