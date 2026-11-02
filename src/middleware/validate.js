const Joi = require('joi');

exports.schemas = {
  signUp: Joi.object({
    name: Joi.string().max(30).required(),
    address: Joi.string().max(255).required(),
    email: Joi.string().email().max(45).required(),
    mobile: Joi.string().pattern(/^\d{10}$/).required(),
    password: Joi.string().min(8).max(100).required(),
  }),
  signIn: Joi.object({
    email: Joi.string().email().max(45).required(),
    password: Joi.string().max(100).required(),
  }),
  adminSignIn: Joi.object({
    email: Joi.string().email().max(45).required(),
    password: Joi.string().max(100).required(),
  }),
  updateAddress: Joi.object({
    address: Joi.string().max(255).required(),
  }),
  updateContact: Joi.object({
    mobileno: Joi.string().pattern(/^\d{10}$/).required(),
  }),
  updatePassword: Joi.object({
    old_password: Joi.string().max(100).required(),
    new_password: Joi.string().min(8).max(100).required(),
  }),
  changePrice: Joi.object({
    item_id: Joi.number().integer().positive().required(),
    NewFoodPrice: Joi.number().integer().positive().required(),
  }),
  addFood: Joi.object({
    FoodName: Joi.string().max(45).required(),
    FoodType: Joi.string().valid('Veg', 'Non-Veg').required(),
    FoodCategory: Joi.string().valid('breakfast', 'lunch', 'dinner', 'beverages', 'desserts').required(),
    FoodServing: Joi.number().integer().positive().required(),
    FoodCalories: Joi.number().integer().positive().required(),
    FoodPrice: Joi.number().integer().positive().required(),
    FoodRating: Joi.number().min(0).max(5).required(),
  }),
};

exports.validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    return res.status(400).json({ errors: error.details.map((d) => d.message) });
  }
  next();
};
