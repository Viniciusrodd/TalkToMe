// modules
import { DataTypes } from "sequelize";
import connection from "../connection/connection";
import { v4 } from "uuid";

const Messages = connection.define('Messages', {
    id:{
        type: DataTypes.CHAR(36),
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    conversationId:{
        type: DataTypes.CHAR(36),
        allowNull: false
    },
    sender:{
        type: DataTypes.ENUM('user', 'llm'),
        allowNull: false
    },
    content:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    tokensUsed:{
        type: DataTypes.INTEGER
    }
}, {
    timestamps: true,
    tableName: 'Messages'
});


export default Messages;