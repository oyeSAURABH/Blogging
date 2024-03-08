import bcrypt from "bcrypt";
import Users from "../app/models/users.model.js";
import Posts from "../app/models/posts.model.js";

const checkUser = async (email, password) => {
  try {
    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    const isPasswordMatch = await new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, function (err, result) {
        if (err) {
          console.log("ERROR: while comparing passwords", err);
          reject(err);
        }
        resolve(result);
      });
    });

    if (isPasswordMatch) {
      return user;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error while checking user", error);
    throw error;
  }
};

const createNewUser = async (email, password, name) => {
  try {
    const hashPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(
        password,
        parseInt(process.env.saltRounds),
        function (err, hash) {
          if (err) {
            console.log("ERROR: while hashing password", err);
            reject(err);
          }
          resolve(hash);
        }
      );
    });

    const user = await Users.create({
      email,
      name,
      password: hashPassword,
    });
    return user;
  } catch (error) {
    console.log("Error while creating New User", error);
    throw error;
  }
};

const readAllUsers = async () => {
  try {
    const users = await Users.findAll();
    const filteredUsers = users?.map((obj) => {
      const { id, name, email, isAdmin, createdAt, updatedAt } = obj;
      return { id, name, email, isAdmin, createdAt, updatedAt };
    });
    return filteredUsers;
  } catch (error) {
    console.log("Error while reading users", error);
    throw error;
  }
};

const toggleAdmin = async (id) => {
  try {
    const user = await Users.findByPk(id);

    if (user) {
      user.isAdmin = !user.isAdmin;
      await user.save();
      return user;
    } else throw new Error(`User with id ${id} not found`);
  } catch (error) {
    console.log("Error while toggling admin", error);
    throw error;
  }
};

const removeUser = async (id) => {
  try {
    //removing all the posts created by user with id
    const deletedPosts = await Posts.destroy({
      where: {
        userId: id,
      },
    });
    if (deletedPosts < 0) throw new Error("Error while deleting Posts of user");
    else if (deletedPosts === 0) console.log("No posts found for the user");

    // now removing user
    const deletedUser = await Users.destroy({
      where: {
        id: id,
      },
    });
    if (deletedUser === 1) {
      return "User deleted successfully";
    } else {
      throw new Error("User not found or not deleted");
    }
  } catch (error) {
    console.log("Error while deleting users", error);
    throw error;
  }
};

const updateUser = async (req, id) => {
  try {
    const { name, email } = req.body;
    console.log(name, email);
    const updatedUser = await Users.update(
      { name, email },
      {
        where: {
          id: id,
        },
        returning: true,
      }
    );
    if (updatedUser[1] === 1) {
      return true;
    } else {
      throw new Error("User not found or not updated");
    }
  } catch (error) {
    console.log("Error while updating users", error);
    throw error;
  }
};

export {
  createNewUser,
  checkUser,
  readAllUsers,
  toggleAdmin,
  removeUser,
  updateUser,
};
