
// hooks
import { createContext, useState } from "react";
import type { ReactNode } from "react"; // specific imports for types


// conversation historic
interface conversationHistoric{
    conversationId: string;
    title: string;
    conversationCreatedAt: Date;
    messages: {
        messageId: string;
        sender: string;
        content: string;
        createdAt?: Date;
    }[];
};

// type
type ConversationContextType = {
    conversation: boolean,
    setConversation: (conversation: boolean) => void,

    conversationHistoric: conversationHistoric[],
    setConversationHistoric: (historic: conversationHistoric[]) => void;
};

// export context
export const ConversationContext = createContext<ConversationContextType>({
    conversation: false,
    setConversation: () => {},

    conversationHistoric: [],
    setConversationHistoric: () => {}
});

// props provider
type ConversationPropsProvider = {
    children: ReactNode;
};


// provider
export const ConversationProvider = ({ children }: ConversationPropsProvider) =>{
    // states
    const [ conversation, setConversation ] = useState<boolean>(false);
    const [ conversationHistoric, setConversationHistoric ] = useState<conversationHistoric[]>([]);


    return(
        <ConversationContext.Provider value={{ 
            conversation, setConversation, conversationHistoric, setConversationHistoric 
        }}>
            { children }
        </ConversationContext.Provider>
    );
};