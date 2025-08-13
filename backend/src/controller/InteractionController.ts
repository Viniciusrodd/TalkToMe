
// models
import models from "../database/relations";
import connection from "../database/connection/connection";
import { json, Op } from "sequelize";
import axios from 'axios';

// express
import { Request, Response } from 'express';
import Conversation from "../database/models/ConversationModel";


// interect request
interface InterectRequest{
    text: string;
    userId: string;
    sender: string;
    conversationId: string | null;
};

// content response
interface contentResponse{
    id?: string;
    title: string;
    llm_result: string;
    conversationId: string | null;
};

// ollama interface
interface OllamaResponse {
    response: string;
    created_at?: string;
    done?: boolean;
}

// get conversations response
interface getConversationsContent{
    conversationId: string;
    messageId: string;
    title: string;
    conversationCreatedAt: Date;
    sender: string;
    content: string;
}

// api response
interface ApiResponse<T = any>{
    success: boolean; 
    message: string; 
    data?: T; 
    errorMessage?: string;
};


// class
class InteractionController{
    // get error message
    getErrorMessage = (error: unknown): string => {
        if(error instanceof Error) return error.message;
        return String(error);
        // if "error" its a instance from Error, we can access his properties, like "error.message" with safety
    };


    // chat interaction =
    // 1. send msg to mistral 
    // 2. save conversations, with condition
    // 3. save messages
    // 4. send: title chat + llm_response + conversationid
    async chatInteraction(
        req: Request<{}, {}, InterectRequest>,
        res: Response<ApiResponse<contentResponse>>
    ){
        const { text, userId, sender, conversationId } = req.body;
        if(!text || !userId || !sender){
            return res.status(400).send({
                success: false,
                message: 'Bad request at fields sended'
            });
        }

        try{
            // user existence check
            const user_exist = await models.User.findByPk(userId);
            if(!user_exist){
                return res.status(404).send({
                    success: false,
                    message: 'User data not found'
                });
            }

            // conversation_id access + title creation
            let conversation_id = conversationId;
            const title = text.slice(0, 15) + '...' || text.slice(0, 5) + '...';
            
            // check conversation existence
            if(!conversation_id){
                // create title
                const conversation_creation = await models.Conversation.create({
                    title, userId
                });
                conversation_id = conversation_creation.id;
            }

            // llm prompt
            const prompt = `Please respond in simple, clear English. 
            Keep answers concise (at maximum 1000 token for be more clear), 
            and avoid complex jargon. Text request: ${text}`;

            // llm request
            const llm_response = await axios.post<OllamaResponse>('http://localhost:11434/api/generate', {
                'model': 'mistral', 
                'prompt': prompt,
                'stream': false
            });
            const result = typeof llm_response.data === 'string' 
            ? llm_response.data 
            : llm_response.data.response;
                        
            // user message sended
            await models.Message.create({
                conversationId: conversation_id,
                sender,
                tokensUsed: text.length,
                content: text
            });
            
            // llm's message sended
            await models.Message.create({
                conversationId: conversation_id,
                sender: 'llm',
                tokensUsed: result.length,
                content: result
            });

            return res.status(200).send({
                success: true,
                message: 'Chat interection success',
                data: { llm_result: result, title, conversationId: conversation_id }
            });
        }
        catch(error: unknown){
            console.error('Internal server error at Chat Interaction', error)
            res.status(500).send({
                success: false,
                message: 'Internal server error at Chat Interaction',
                errorMessage: this.getErrorMessage(error)
            });
        }
    };


    // get conversations
    async getConversations(
        req: Request,
        res: Response<ApiResponse<getConversationsContent[]>>
    ){
        const userId = req.params.userID;
        if(!userId){
            return res.status(400).send({
                success: false,
                message: 'Bad request at fields sended'
            });
        }

        try{
            // check user existence
            const user_exist = await models.User.findByPk(userId);
            if(!user_exist){
                return res.status(404).send({
                    success: false,
                    message: 'User data not found'
                });
            }

            // get conversations + messages
            const conversations = await models.Conversation.findAll({
                where: { userId },
                attributes: [ 'id', 'title', 'createdAt' ],
                include: [{
                    model: models.Message,
                    as: 'messages',
                    attributes: [ 'id', 'sender', 'content' ]
                }],
                order: [
                    [ 'createdAt', 'ASC' ], // conversation order - older to new
                    [ { model: models.Message, as: 'messages' }, 'createdAt', 'ASC' ] // messages order
                ]
            });

            // check conversations existence
            if(conversations.length === 0){
                return res.status(204).send({
                    success: true,
                    message: 'None conversations found'
                });
            }

            // format response for <getConversationContent> interface
            const formatResponse: getConversationsContent[] = conversations.flatMap(conv => { // "flatMap": maps each element and then flattens the result into a single level 1 array.
                return (conv.messages || []).map(msg => ({
                    conversationId: conv.id,
                    messageId: msg.id,
                    title: conv.title,
                    conversationCreatedAt: conv.createdAt,
                    sender: msg.sender,
                    content: msg.content
                } as getConversationsContent));
            });

            return res.status(200).send({
                success: true,
                message: 'Get conversations success',
                data: formatResponse
            });
        }
        catch(error: unknown){
            console.error('Internal server error at Get conversations', error);
            return res.status(500).send({
                success: false,
                message: 'Internal server error at Get conversations',
                errorMessage: this.getErrorMessage(error)
            });
        }
    }
};


export default new InteractionController();