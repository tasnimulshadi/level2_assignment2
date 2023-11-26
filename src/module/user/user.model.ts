import { Schema, model } from 'mongoose'
import {
  IUser,
  TAddress,
  TFullName,
  TOrder,
  TUserMethods,
  TUserModel,
} from './user.interface'
import bcrypt from 'bcrypt'
import config from '../../app/config'

// Define the sub-schemas for TFullName, TAddress, and TOrders
const fullNameSchema = new Schema<TFullName>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
})

const addressSchema = new Schema<TAddress>({
  street: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
})

const ordersSchema = new Schema<TOrder>({
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
})

const userSchema = new Schema<IUser, TUserModel, TUserMethods>({
  userId: { type: Number, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  fullName: { type: fullNameSchema, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true },
  isActive: { type: Boolean, required: true },
  hobbies: { type: [String], required: true },
  address: { type: addressSchema, required: true },
  orders: { type: [ordersSchema] },
})

userSchema.pre('save', async function (next) {
  // hashing password before save
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this //current document
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  )

  next()
})

userSchema.post('save', function (doc, next) {
  //remove password
  doc.password = ''
  next()
})

userSchema.methods.isUserExists = async function (userId: number) {
  const user = UserModel.aggregate([
    // stage 1 matching userId
    {
      $match: { userId: { $eq: userId } },
    },
    // stage show specified data
    {
      $project: {
        password: 0,
      },
    },
  ])
  return user
}

export const UserModel = model<IUser, TUserModel>('User', userSchema)
