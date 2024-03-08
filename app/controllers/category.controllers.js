import Category from "../models/category.model.js";

const ceateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .send({ success: false, data: "mention category name" });
    }
    const category = await Category.create({ name });
    return res.send({ success: true, data: category });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, data: error.message || "Internal Server Error" });
  }
};
const readCategory = async (req, res) => {
  try {
    const category = await Category.findAll();
    return res.send({ success: true, data: category });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, data: error.message || "Internal Server Error" });
  }
};
const updateCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const { name } = req.body;
    if (!id) {
      return res.status(400).send({ success: false, data: "provide id" });
    }
    const updated = await Category.update(
      { name },
      {
        where: { id },
        returning: true,
        plain: true,
      }
    );
    if (updated[1] === 1) {
      const updatedCat = await Category.findByPk(id);
      return res.send({ success: true, data: updatedCat });
    }
    return res.send({ success: false, data: "couldn't update" });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, data: error.message || "Internal Server Error" });
  }
};
const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).send({ success: false, data: "provide id" });
    }
    const isDeleted = await Category.destroy({
      where: {
        id,
      },
    });
    if (isDeleted) {
      const remainingData = await Category.findAll();
      return res.send({ success: true, data: remainingData });
    } else return res.send({ success: false, data: "couldn't delete" });
  } catch (error) {
    return res
      .status(500)
      .send({
        success: false,
        message: error.message || "Internal Server Error",
      });
  }
};
export { ceateCategory, readCategory, updateCategory, deleteCategory };
