import sequelize from "../../config/connect.js";

import "./posts.model.js";
import "./users.model.js";
import "./category.model.js";
import "./auditLog.model.js";
import "./comment.model.js";

const syncModels = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("All models synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing models: ", error);
  } finally {
    await sequelize.close();
  }
};

export default sequelize;
