
// models
import models from "../database/relations";
import connection from "../database/connection/connection";
import { json, Op } from "sequelize";
import axios from 'axios';

// express
import { Request, Response } from 'express';

// utils
import { formatFileSize } from "../utils/filesUtil";
import { extractRelevantContent } from "../utils/filesUtil";


// interect request
interface InterectRequest{
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
    title: string;
    conversationCreatedAt: Date;
    messages: {
        messageId: string;
        sender: string;
        content: string;
        createdAt: Date
    }[];
};

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
        const { text, userId, sender, conversationId, file } = req.body;
        if(!text || !userId || !sender){
            return res.status(400).send({
                success: false,
                message: 'Bad request at fields sended'
            });
        }

        if(file && file.size > 5 * 1024 * 1024){ // 5MB
            return res.status(400).send({
                success: false,
                message: 'Big file error (limit: 5MB)'
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
            const title = text.slice(0, 25) + '...' || text.slice(0, 5) + '...';
            
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
            and avoid complex jargon. Text request: ${text}.`;

            // llm prompt (with file)
            const promptWithFile = file ? 
                `Please respond in simple, clear English. 
                Keep answers concise (at maximum 1000 token for be more clear), 
                and avoid complex jargon. Give the answer with a file name, type, size and content
                before the answer... 
                - Text request: ${text}.
                - File request: ${file?.name}
                - File type: ${file?.type}
                - File size: ${formatFileSize(file.size)}
                - Relevant content: ${file.content ? extractRelevantContent(file.content) : 'No content to extract'}` 
            : prompt;

            // llm request
            const llm_response = await axios.post<OllamaResponse>('http://localhost:11434/api/generate', {
                'model': 'mistral', 
                'prompt': file ? promptWithFile : prompt,
                'stream': false
            });
            const result = typeof llm_response.data === 'string' 
            ? llm_response.data 
            : llm_response.data.response;
                        
            // user message sended - save
            await models.Message.create({
                conversationId: conversation_id,
                sender,
                tokensUsed: text.length,
                content: text,
                createdAt: new Date()
            });
            
            // llm's message sended - save
            await models.Message.create({
                conversationId: conversation_id,
                sender: 'llm',
                tokensUsed: result.length,
                content: result,
                createdAt: new Date(Date.now() + 2000) // +seg
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
                message: 'Bad request at params sended'
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
                    attributes: [ 'id', 'sender', 'content', 'createdAt' ]
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
            const formatResponse = conversations.map(conv =>({
                conversationId: conv.id,
                title: conv.title,
                conversationCreatedAt: conv.createdAt,
                messages: (conv.messages || []).map(msg => ({
                    messageId: msg.id,
                    sender: msg.sender,
                    content: msg.content,
                    createdAt: msg.createdAt
                }))
            }));

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


    // search for conversation
    async searchConversation(
        req: Request,
        res: Response<ApiResponse<getConversationsContent[]>>
    ){
        const { userID, title } = req.params;
        if(!userID || !title){
            return res.status(400).send({
                success: false,
                message: 'Bad request at params sended'
            });
        }

        try{
            // user existence check
            const user_exist = await models.User.findByPk(userID);
            if(!user_exist){
                return res.status(404).send({
                    success: false,
                    message: 'User data not found'
                });
            }

            // conversation existence check
            const conversations = await models.Conversation.findAll({ 
                where: { 
                    userId: userID,
                    title: { [Op.like]: `%${title}%` } 
                },
                include: [{
                    model: models.Message,
                    as: 'messages'
                }],
                order: [
                    [ 'createdAt', 'ASC' ], // conversation order - older to new
                    [ { model: models.Message, as: 'messages' }, 'createdAt', 'ASC' ] // messages order
                ]
            });
            if(!conversations || conversations.length === 0){
                return res.status(204).send({
                    success: true,
                    message: 'Conversation not found'
                });
            }

            // format response    
            const formatResponse = conversations.map(conv => ({
                conversationId: conv.id,
                title: conv.title,
                conversationCreatedAt: conv.createdAt,
                messages: (conv.messages || []).map(msg => ({
                    messageId: msg.id,
                    sender: msg.sender,
                    content: msg.content,
                    createdAt: msg.createdAt
                }))
            }));

            return res.status(200).send({
                success: true,
                message: 'Conversation searched found with success',
                data: formatResponse
            });
        }
        catch(error: unknown){
            console.error('Internal server error at Search conversation', error);
            return res.status(500).send({
                success: false,
                message: 'Internal server error at Search conversation',
                errorMessage: this.getErrorMessage(error)
            });
        }
    }


    // delete chat
    async deleteChat(
        req: Request,
        res: Response<ApiResponse>
    ){
        const conversation_id = req.params.conversationID;
        if(!conversation_id){
            return res.status(400).send({
                success: false,
                message: 'Bad request at params sended'
            });
        }

        try{
            // check conversations existence
            const conversation = await models.Conversation.findByPk(conversation_id);
            if(!conversation){
                return res.status(204).send({
                    success: true,
                    message: 'Conversation not found'
                });
            }

            // delete conversation + messages
            await connection.transaction(async (t) =>{
                await models.Message.destroy({
                    where: { conversationId: conversation_id },
                    transaction: t
                });               
                
                await models.Conversation.destroy({
                    where: { id: conversation_id },
                    transaction: t
                });                
            });

            return res.status(200).send({
                success: true,
                message: 'Destroy conversation success',
            });
        }
        catch(error: unknown){
            console.error('Internal server error at Delete chat: ', error);
            return res.status(500).send({
                success: false,
                message: 'Internal server error at Delete chat',
                errorMessage: this.getErrorMessage(error)
            });
        }
    }
};


export default new InteractionController();