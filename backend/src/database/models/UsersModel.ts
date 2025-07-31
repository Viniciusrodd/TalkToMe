// modules
import { DataTypes, Model, Optional } from "sequelize";
import connection from "../connection/connection";
import { v4 } from "uuid";


// interface
interface UserAttributes{
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date
};

// type // necessary attributes in creation
type UserCreationAttributes = Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'>;

// class
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes{ // 'implements' forces a class have a UserAttributes fields
    public id!: string; // "!" = definite assignment assertion
    public name!: string;
    public email!: string;
    public password!: string;

    // timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // public: visible outside the class (default in TypeScript)
    // readonly: cannot be changed after creation (useful for createdAt, updatedAt)
};


User.init({ // .init() its like "define" but in classes
    id:{
        type: DataTypes.CHAR(36),
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    name:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email:{
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(150),
        allowNull: false
    }
}, {
    sequelize: connection,
    modelName: 'User',
    timestamps: true,
    tableName: 'Users'
});


export default User;