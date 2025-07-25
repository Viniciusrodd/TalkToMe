// modules
import { DataTypes } from "sequelize";
import connection from "../connection/connection";
import { v4 } from "uuid";

const User = connection.define('Users', {
    id:{
        type: DataTypes.CHAR(36),
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    name:{
        type: DataTypes.STRING(100),
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
    timestamps: true,
    tableName: 'Users'
});


export default User; // use in controller