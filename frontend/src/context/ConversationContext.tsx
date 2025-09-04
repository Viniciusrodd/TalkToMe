
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
        createdAt?: String;
    }[];
};

// conversation exibition
interface iConversationShow{
    conversationId: string;
    title: string;
}


// type
type ConversationContextType = {
    conversation: boolean,
    setConversation: (conversation: boolean) => void,

    conversationHistoric: conversationHistoric[],
    setConversationHistoric: (historic: conversationHistoric[]) => void;

    conversationsShow: iConversationShow[],
    setConversationsShow: React.Dispatch<React.SetStateAction<iConversationShow[]>>;
};

// export context
export const ConversationContext = createContext<ConversationContextType>({
    conversation: false,
    setConversation: () => {},

    conversationHistoric: [],
    setConversationHistoric: () => {},

    conversationsShow: [],
    setConversationsShow: () => {}
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
    const [ conversationsShow, setConversationsShow ] = useState<iConversationShow[]>([]);
    

    return(
        <ConversationContext.Provider value={{ 
            conversation, setConversation, 
            conversationHistoric, setConversationHistoric,
            conversationsShow, setConversationsShow
        }}>
            { children }
        </ConversationContext.Provider>
    );
};