//users.model.js
import sequelize from "../../config/connect.js";
import { DataTypes } from "sequelize";

// import Post from "./posts.model.js";
// import Comment from "./comment.model.js";

const Users = sequelize.define("Users", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

// Users.hasMany(Post);
// Users.hasMany(Comment);

export default Users;
