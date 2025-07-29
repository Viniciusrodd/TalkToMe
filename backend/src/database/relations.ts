
// models
import Conversation from "./models/ConversationModel";
import Messages from "./models/MessagesModel";
import User from "./models/UsersModel";

// relations

// 1 user can have many conversations
User.hasMany(Conversation, { foreignKey: 'user_id' });
Conversation.belongsTo(User, { foreignKey: 'user_id' });

// 1 conversations can have many messages
Conversation.hasMany(Messages, { foreignKey: 'conversation_id' });
Messages.belongsTo(Conversation, { foreignKey: 'conversation_id' });

// exporting models
const models = {
    Conversation, Messages, User
};
export default models;