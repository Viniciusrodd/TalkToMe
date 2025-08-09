
// hooks
import { createContext, useState } from "react";
import type { ReactNode } from "react";


// loading type
type LoadingContextType = {
    loading: boolean,
    setLoading: (loading: boolean) => void;
};

// props provider
type LoadingPropsProvider = {
    children: ReactNode;
};


// export context
export const LoadingContext = createContext<LoadingContextType>({
    loading: false,
    setLoading: () => {}
});


// provider
export const LoadingProvider = ({ children }: LoadingPropsProvider) =>{
    const [ loading, setLoading ] = useState<boolean>(false);

    return(
        <LoadingContext.Provider value={{ loading, setLoading }}>
            { children }
        </LoadingContext.Provider>
    )
};