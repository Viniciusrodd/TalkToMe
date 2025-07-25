// imports (sintaxe ES Modules)
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import router from './routes/routes';

// ambience variables
dotenv.config();

// init express
const app = express();

// middlewares
app.use(cookieParser()); // this middleware allow us to read cookies
app.use(express.json({ limit: '10mb' })); // "limit" for receive large datas
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// cors
app.use(
    cors({
        origin: process.env.FRONTEND_PORT,
        credentials: true,
    })
);

// router
app.use('/', router);


export default app;