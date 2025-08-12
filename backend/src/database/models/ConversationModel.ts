// modules
import { DataTypes, Model, Optional } from "sequelize";
import connection from "../connection/connection";
import { v4 } from "uuid";


interface ConversationAttributes{
    id: number;
    title: string;
    userId: number;
    model?: string;
    createdAt?: Date;
    updatedAt?: Date
};

// option attributes
type ConversationOptionAttributes = Optional<ConversationAttributes, 'id' | 'model' | 'createdAt' | 'updatedAt'>;

// class
class Conversation extends Model<ConversationAttributes, ConversationOptionAttributes> implements ConversationAttributes{
    public id!: number;
    public title!: string;
    public userId!: number;
    public model!: string;

    // timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
};


// model
Conversation.init({
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
    sequelize: connection,
    modelName: 'Conversation',
    timestamps: true,
    tableName: 'Conversations'
});


export default Conversation;