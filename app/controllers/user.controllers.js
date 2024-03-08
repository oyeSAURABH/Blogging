import {
  createNewUser,
  checkUser,
  readAllUsers,
  toggleAdmin,
  removeUser,
  updateUser,
} from "../../utils/userAuth.js";
import Randomstring from "randomstring";
import sendOtpToEmail from "../../utils/sendOtpToEmail.js";

const userLogIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .send({ success: false, message: "provide email or password" });
    }
    const user = await checkUser(email, password);
    if (!user)
      return res.send({
        success: false,
        message: "Email or Password doesnt match",
      });
    req.session.user = user;
    req.session.authorized = true;
    res.send({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
const userRegister = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res
        .status(400)
        .send({ success: false, message: "provide email or password or name" });
    }
    const user = await createNewUser(email, password, name);

    return res.send({ success: true, data: user });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
const userRead = async (req, res) => {
  try {
    const allUsers = await readAllUsers();
    return res.send({ success: true, data: allUsers });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
const userToggleAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.send({ success: false, data: "please provide id" });
    }
    await toggleAdmin(id);
    return res.send({ success: true, data: "toggled the admin access" });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
const userDelete = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.send({ success: false, data: "please provide id" });
    }

    const deletedUser = await removeUser(id);
    return res.send({ success: true, data: deletedUser });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
const userUpdate = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.send({ success: false, data: "please provide id" });
    }
    const updatedUser = await updateUser(req, id);
    return res.send({ success: true, data: updatedUser });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

//otp
// const otpArray = new Set();
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = Randomstring.generate({
      length: 6,
      charset: "numeric",
    });
    await sendOtpToEmail(email, otp);
    // otpArray.add(otp);
    req.session.otp = otp;
    res.send({ success: true, data: "OTP has been sent" });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
const verifyOtp = async (req, res, next) => {
  try {
    const { otp } = req.body;
    if (req.session.otp != otp)
      return res.status(402).send({ success: false, data: "invalid OTP" });
    // otpArray.delete(otp);
    // console.log(otp);
    next();
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
export {
  userLogIn,
  userRegister,
  userRead,
  userToggleAdmin,
  userDelete,
  userUpdate,
  verifyOtp,
  sendOtp,
};
