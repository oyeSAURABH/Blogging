import Post from "../app/models/posts.model.js";
import User from "../app/models/users.model.js";
import Category from "../app/models/category.model.js";
import dotenv from "dotenv";
dotenv.config();
import CryptoJS from "crypto-js";
import { Op } from "sequelize";
const secretKey = process.env.secretKey;

const createNewPost = async (
  title,
  summary,
  tags,
  postText,
  userId,
  categoryId,
  image
) => {
  try {
    const post = await Post.create({
      title,
      postText,
      userId,
      categoryId,
      image,
      summary,
      tags,
    });
    // Encrypt the newly created post ID
    const encryptId = encryptPostId(post.id);
    if (!encryptId) {
      throw new Error("Error while encrypting post Id");
    }

    await post.update({ encryptId });
    return post;
  } catch (error) {
    console.log("Error while creating New Post", error);
    throw error;
  }
};

const readPostByIdOrCat = async (encryptId, cat, offset) => {
  try {
    let posts;
    let limit = 6;
    offset = parseInt(offset) || 0;
    let totalCount;

    const includeOptions = [
      { model: User, as: "user", attributes: ["name"] },
      { model: Category, as: "category", attributes: ["name"] },
    ];

    if (!encryptId && !cat) {
      posts = await Post.findAll({
        offset: offset,
        limit: limit,
        include: includeOptions,
      });
      totalCount = await Post.count();
    } else if (encryptId) {
      const id = decryptPostId(encryptId);
      console.log(id);
      posts = await Post.findByPk(id, { include: includeOptions });
      totalCount = 1;
    } else {
      posts = await Post.findAll({
        where: {
          categoryId: cat,
        },
        offset: offset,
        limit: limit,
        include: includeOptions,
      });
      totalCount = await Post.count({
        where: {
          categoryId: cat,
        },
      });
    }
    return { posts, totalCount };
  } catch (error) {
    console.log("Error while reading Post", error);
    throw error;
  }
};
const readPostByTags = async (tag, offset) => {
  try {
    let posts;
    let limit = 6;
    offset = parseInt(offset) || 0;
    let totalCount;
    const includeOptions = [
      { model: User, as: "user", attributes: ["name"] },
      { model: Category, as: "category", attributes: ["name"] },
    ];
    posts = await Post.findAll({
      offset: offset,
      limit: limit,
      include: includeOptions,
      where: {
        tags: {
          [Op.like]: "%" + tag + "%",
        },
      },
    });
    totalCount = await Post.count({
      where: {
        tags: {
          [Op.like]: "%" + tag + "%",
        },
      },
    });
    return { posts, totalCount };
  } catch (error) {
    console.log("Error while reading Post", error);
    throw error;
  }
};
const updatePostById = async (encryptId, req) => {
  try {
    const id = decryptPostId(encryptId);
    const { image, userId, ...restData } = req.body;
    let data = restData;
    if (req?.file) {
      data.image = req?.file?.path;
    }
    const updatedPosts = await Post.update(data, {
      where: {
        id: id,
      },
      returning: true,
    });
    if (updatedPosts[1] === 1) {
      req.postId = id;
      return true;
    } else {
      throw new Error("Post not found or not updated");
    }
  } catch (error) {
    console.log("Error while updating Post", error);
    throw error;
  }
};

const deletePostById = async (encryptId, req) => {
  try {
    const id = decryptPostId(encryptId);
    const deletedRowCount = await Post.destroy({
      where: {
        id: id,
      },
    });

    if (deletedRowCount === 1) {
      req.postId = id;
      return "Post deleted successfully";
    } else {
      throw new Error("Post not found or not deleted");
    }
  } catch (error) {
    console.log("Error while deleting Post", error);
    throw error;
  }
};

// Utility function to encrypt the post ID and return as hexadecimal string
const encryptPostId = (postId) => {
  const encrypted = CryptoJS.AES.encrypt(
    postId.toString(),
    secretKey
  ).toString();

  const hexString = CryptoJS.enc.Hex.stringify(
    CryptoJS.enc.Base64.parse(encrypted)
  );

  return hexString;
};

// Utility function to decrypt the encrypted post ID from hexadecimal string
const decryptPostId = (encryptedPostId) => {
  const base64String = CryptoJS.enc.Base64.stringify(
    CryptoJS.enc.Hex.parse(encryptedPostId)
  );

  try {
    const decrypted = CryptoJS.AES.decrypt(base64String, secretKey).toString(
      CryptoJS.enc.Utf8
    );

    return parseInt(decrypted, 10);
  } catch (error) {
    console.error("Error decrypting post ID:", error);
    return null;
  }
};

export {
  createNewPost,
  readPostByIdOrCat,
  readPostByTags,
  updatePostById,
  deletePostById,
  decryptPostId,
};
