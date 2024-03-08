import {
  createNewPost,
  readPostByIdOrCat,
  readPostByTags,
  updatePostById,
  deletePostById,
} from "../../utils/postUtils.js";
import auditLog from "../models/auditLog.model.js";
import Users from "../models/users.model.js";

const ceatePost = async (req, res, next) => {
  try {
    const { title, postText, userId, categoryId, tags, summary } = req.body;
    console.log("summary", summary);
    console.log("tags", tags);
    if (!title || !postText || !userId || !categoryId || !summary) {
      return res.status(400).send({
        success: false,
        data: "provide title or postText or userID or categoryId or summary",
      });
    }
    const image = req.file?.path;
    const post = await createNewPost(
      title,
      summary,
      tags,
      postText,
      userId,
      categoryId,
      image
    );
    req.data = post;
    req.postId = post.id;
    next();
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, data: error.message || "Internal Server Error" });
  }
};

const readPost = async (req, res) => {
  try {
    const id = req.query.id;
    const cat = req.query.cat;
    const tag = req.query.tag;
    const offset = req.query.offset;

    if (tag) {
      const { posts, totalCount } = await readPostByTags(tag, offset);
      return res.send({ success: true, data: posts, totalCount });
    } else {
      const { posts, totalCount } = await readPostByIdOrCat(id, cat, offset);
      return res.send({ success: true, data: posts, totalCount });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, data: error.message || "Internal Server Error" });
  }
};

const updatePost = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedPost = await updatePostById(id, req);
    req.data = updatedPost;
    next();
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, data: error.message || "Internal Server Error" });
  }
};

const deletePost = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedPost = await deletePostById(id, req);
    req.data = deletedPost;
    next();
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, data: error.message || "Internal Server Error" });
  }
};

// to read auditlogs from audit tables
const readAuditLogs = async (req, res) => {
  try {
    const includeOptions = [{ model: Users, as: "user", attributes: ["name"] }];
    const data = await auditLog.findAll({ include: includeOptions });
    return res.send({
      success: true,
      data,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, data: error.message || "Internal Server Error" });
  }
};

export { ceatePost, readPost, updatePost, deletePost, readAuditLogs };
