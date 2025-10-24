import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";

import People from "../../models/people.model.js";
const doLoginValidators = [
  check("username")
    .isLength({ min: 1 })
    .withMessage("Mobile or email is required")
    .custom(async (value, { req }) => {
      const user = await People.findOne({
        $or: [{ email: value }, { mobile: value }],
      });
      if (user) {
        req.user = user;
        req.userPassword = user.password;
      } else {
        throw new Error("invalid username or mobile number");
      }
      return true;
    }),
  check("password")
    .isLength({ min: 1 })
    .withMessage("Password is required")
    .custom(async (value, { req }) => {
      if (req.userPassword) {
        const isValidPassword = await bcrypt.compare(
          req.body.password,
          req.userPassword
        );
        if (!isValidPassword) {
          throw new Error("invalid password");
        }
      }
    }),
];

const loginValidationHandler = (req, res, next) => {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();

  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    res.status(400).json({
      errors: mappedErrors,
    });
  }
};

export { doLoginValidators, loginValidationHandler };
