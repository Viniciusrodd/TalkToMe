// modules
import { DataTypes, Optional, Model } from "sequelize";
import connection from "../connection/connection";
import { v4 } from "uuid";


// messages attributes
interface MessageAttributes{
    id: string;
    conversationId: string;
    sender: string;
    content: string;
    tokensUsed: number;
    createdAt?: Date;
    updatedAt?: Date;
};

// option attributes
type MessagesOptionAttributes = Optional<MessageAttributes, 'id' | 'createdAt' | 'updatedAt'>;

// class
class Message extends Model<MessageAttributes, MessagesOptionAttributes> implements MessageAttributes{
    public id!: string;
    public conversationId!: string;
    public sender!: string;
    public content!: string;
    
    // timestamps
    public readonly tokensUsed!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
};


// model
Message.init({
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
    sequelize: connection,
    modelName: 'Message',
    timestamps: true,
    tableName: 'Messages'
});


export default Message;