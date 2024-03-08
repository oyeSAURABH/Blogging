// posts.model.js
import sequelize from "../../config/connect.js";
import { DataTypes } from "sequelize";

import Users from "./users.model.js";
import Category from "./category.model.js";
import Comment from "./comment.model.js";

const Post = sequelize.define(
  "Post",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    encryptId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    summary: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tags: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    postText: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

Post.belongsTo(Users, { foreignKey: "userId", as: "user" });
Post.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
Post.hasMany(Comment, { foreignKey: "postId", as: "comments" });

export default Post;
