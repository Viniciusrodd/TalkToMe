
// hooks
import { createContext, useState } from "react";
import type { ReactNode } from "react"; // specific imports for types

// type
type ConversationContextType = {
    conversation: boolean,
    setConversation: (conversation: boolean) => void,
};

// props provider
type ConversationPropsProvider = {
    children: ReactNode;
};

// export context
export const ConversationContext = createContext<ConversationContextType>({
    conversation: false,
    setConversation: () => {}
});


// provider
export const ConversationProvider = ({ children }: ConversationPropsProvider) =>{
    // states
    const [ conversation, setConversation ] = useState<boolean>(false);

    return(
        <ConversationContext.Provider value={{ conversation, setConversation }}>
            { children }
        </ConversationContext.Provider>
    );
};