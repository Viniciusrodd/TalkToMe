// modules
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// ambience variables
dotenv.config();

// ambience variables validation
if (!process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD) {
    throw new Error('Ambience variables: DB_NAME, DB_USER, DB_PASSWORD not defined!');
}

// connection
const connection: Sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD, {
        host: 'localhost',
        dialect: 'mysql',
        timezone: '-03:00'
    }
);

export default connection;