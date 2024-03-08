import Joi from "joi";

const emailSchema = Joi.string().email().required();
const passwordSchema = Joi.string().min(6).required();

const validateCredentials = (req, res, next) => {
  const { error: emailError } = emailSchema.validate(req.body.email);
  if (emailError) {
    return res.status(400).json({ error: emailError.details[0].message });
  }

  const { error: passwordError } = passwordSchema.validate(req.body.password);
  if (passwordError) {
    return res.status(400).json({ error: passwordError.details[0].message });
  }

  next();
};
export default validateCredentials;
