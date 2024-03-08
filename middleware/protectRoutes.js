import Post from "../app/models/posts.model.js";
import { decryptPostId } from "../utils/postUtils.js";

const protectRoutesAll = (req, res, next) => {
  try {
    console.log(req.session);
    if (req.session.authorized) {
      next();
    } else {
      throw new Error("Unauthorized");
    }
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Unauthorized" });
  }
};
const protectRoutesSpecific = async (req, res, next) => {
  try {
    const id = decryptPostId(req.params.id);
    if (!id) {
      return res
        .status(400)
        .send({ success: false, data: "please provide id" });
    }
    const post = await Post.findByPk(id);
    if (
      post.dataValues.userId == req.session.user.id ||
      req.session.user.isAdmin
    )
      next();
    else throw new Error("Unauthorized");
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Unauthorized" });
  }
};
const protectRoutesAdmin = async (req, res, next) => {
  try {
    if (req.session.user.isAdmin) {
      next();
    } else throw new Error("Unauthorized");
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Unauthorized" });
  }
};
export { protectRoutesAll, protectRoutesSpecific, protectRoutesAdmin };
