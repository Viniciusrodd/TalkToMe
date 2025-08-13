
// models
import Conversation from "./models/ConversationModel";
import Message from "./models/MessagesModel";
import User from "./models/UsersModel";

// relations

// 1 user can have many conversations
User.hasMany(Conversation, { foreignKey: 'userId' });
Conversation.belongsTo(User, { foreignKey: 'userId' });

// 1 conversations can have many messages
Conversation.hasMany(Message, { foreignKey: 'conversationId', as: 'messages' });
Message.belongsTo(Conversation, { foreignKey: 'conversationId' });

// exporting models
const models = {
    Conversation, Message, User
};
export default models;