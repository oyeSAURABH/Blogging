import gaaliya from "../gaaliya.js";

const filterComment = (req, res, next) => {
  try {
    const { comment } = req.body;
    const commentArray = comment.split(" ");
    commentArray.forEach((e, i) => {
      if (gaaliya.includes(e)) {
        let gaali = "";
        for (let j = 0; j < e.length; j++) gaali += "*";
        commentArray[i] = gaali;
      }
    });
    const finalComment = commentArray.join(" ");
    req.finalComment = finalComment;
    next();
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
export { filterComment };
