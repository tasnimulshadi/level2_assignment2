import Joi from 'joi'

const joiFullNameSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
})

const joiAddressSchema = Joi.object({
  street: Joi.string().required(),
  city: Joi.string().required(),
  country: Joi.string().required(),
})

const joiOrderSchema = Joi.object({
  productName: Joi.string().required(),
  price: Joi.number().required(),
  quantity: Joi.number().required(),
})

const joiUserSchema = Joi.object({
  userId: Joi.number().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
  fullName: joiFullNameSchema.required(),
  age: Joi.number().required().min(1),
  email: Joi.string().required().email(),
  isActive: Joi.boolean().required(),
  hobbies: Joi.array().items(Joi.string()).required(),
  address: joiAddressSchema.required(),
  orders: Joi.array().items(joiOrderSchema),
  isDeleted: Joi.boolean().default(false),
})

export default joiUserSchema
