
// models
import models from "../database/relations";
import connection from "../database/connection/connection";
import { json, Op } from "sequelize";
import axios from 'axios';

// express
import { Request, Response } from 'express';


// interect request
interface InterectRequest{
    text: string;
    userId: string;
    sender: string;
};

// content response
interface contentResponse{
    id?: string;
    title: string;
    llm_result: string;
}

// api response
interface ApiResponse<T = any>{
    success: boolean; 
    message: string; 
    data?: T; 
    errorMessage?: string;
};

// ollama interface
interface OllamaResponse {
    response: string;
    created_at?: string;
    done?: boolean;
}


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
    // 2. save conversations
    // 3. save messages
    // 4. send: title chat + llm_response 
    async chatInteraction(
        req: Request<{}, {}, InterectRequest>,
        res: Response<ApiResponse<contentResponse>>
    ){
        const { text, userId, sender } = req.body;
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
                    message: 'User email data not found'
                });
            }

            // create title
            const title = text.slice(0, 15) + '...' || text.slice(0, 5) + '...';

            // llm prompt
            const prompt = `Please respond in simple, clear English. 
            Keep answers concise (at maximum 1000 token for be more clear), 
            and well-formatted for rendering in an HTML <p> tag. Use proper line breaks, spacing, 
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


            // transactions - conversation + message (creation)
            await connection.transaction(async (t) =>{
                const conversation_creation = await models.Conversation.create({
                    title, userId
                });

                // user message sended
                await models.Messages.create({
                    conversationId: conversation_creation.id,
                    sender,
                    tokensUsed: text.length,
                    content: text
                });

                // llm's message sended
                await models.Messages.create({
                    conversationId: conversation_creation.id,
                    sender: 'llm',
                    tokensUsed: result.length,
                    content: result
                });
            });


            return res.status(200).send({
                success: true,
                message: 'Chat interection success',
                data: { llm_result: result, title }
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
};


export default new InteractionController();