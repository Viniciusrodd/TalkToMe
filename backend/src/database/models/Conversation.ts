// modules
import { DataTypes } from "sequelize";
import connection from "../connection/connection";
import { v4 } from "uuid";

const Conversation = connection.define('Conversations', {
    id:{
        type: DataTypes.CHAR(36),
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    title:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    userId:{
        type: DataTypes.CHAR(36),
        allowNull: false
    },
    model: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'mistral'
    }    
}, {
    timestamps: true,
    tableName: 'Conversations'
});


export default Conversation;