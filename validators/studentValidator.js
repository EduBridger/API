import Joi from "joi";

export const studentSchema = Joi.object({

  firstName: Joi.string().required().max(255),

  lastName: Joi.string().required().max(255),

  course: Joi.string().required().max(255),

  level: Joi.string().required().max(255),

  role: Joi.string().required().max(255),

  email: Joi.string().lowercase().email().required(),

  password: Joi.string()
    .min(8)
    .pattern(/[0-9]/)
    .message(
      'Password must be at least 8 characters long and include at least one number'
    )
    .required(),

});

