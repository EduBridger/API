import Joi from "joi";

export const createCourseSchema = Joi.object({
  name: Joi.string().required().max(255),
  description: Joi.string().required(),
  duration: Joi.number().positive().required(),
  status: Joi.string().valid("active", "inactive").default("active"),
  teacher: Joi.string().required(),
  
});

export const updateCourseSchema = Joi.object({
  name: Joi.string().max(255),
  description: Joi.string(),
  duration: Joi.number().positive(),
  status: Joi.string().valid("active", "inactive"),
  instructor: Joi.string(),
  enrollmentCount: Joi.number().integer().min(0),
  prerequisites: Joi.array().items(Joi.string())
});