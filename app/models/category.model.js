//category.model.js
import sequelize from "../../config/connect.js";
import { DataTypes } from "sequelize";

import Post from "./posts.model.js";

const category = sequelize.define("Category", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// category.hasMany(Post);

export default category;
