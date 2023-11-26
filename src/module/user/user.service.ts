import config from '../../app/config'
import { IUser, TOrder } from './user.interface'
import { UserModel } from './user.model'
import bcrypt from 'bcrypt'

// Create a new user
const createUserIntoDB = async (userData: IUser) => {
  const result = await UserModel.create(userData)
  return result
}

// Retrieve a list of all users
const getAllUsersFromDB = async () => {
  const result = await UserModel.aggregate([
    // stage 1 - username, fullName, age, email, address
    {
      $project: {
        username: 1,
        fullName: 1,
        age: 1,
        email: 1,
        address: 1,
      },
    },
  ])

  return result
}

// Retrieve a specific user by ID
const getUserByIdFromDB = async (userId: number) => {
  // check if user exists or not
  const userInstance = new UserModel()
  if ((await userInstance.isUserExists(userId)) == null) {
    throw new Error('User not found')
  }

  const result = await UserModel.findOne({ userId: userId })
  return result
}

// Update user information
const updateUserIntoDB = async (userId: number, userData: IUser) => {
  // check if user exists or not
  const userInstance = new UserModel()
  if ((await userInstance.isUserExists(userId)) == null) {
    throw new Error('User not found')
  }

  // hashing password before update
  userData.password = await bcrypt.hash(
    userData.password,
    Number(config.bcrypt_salt_rounds),
  )

  const result = await UserModel.updateOne(
    { userId: userId },
    { $set: userData },
  )

  return result
}

// Delete User (update isDeleted)
const deleteUserIntoDB = async (userId: number) => {
  // check if user exists or not
  const userInstance = new UserModel()
  if ((await userInstance.isUserExists(userId)) == null) {
    throw new Error('User not found')
  }

  const result = await UserModel.updateOne(
    { userId: userId },
    { $set: { isDeleted: true } },
  )

  return result
}

// Add New Product in Order (update orders)
const createOrderByIdIntoDB = async (userId: number, productData: TOrder) => {
  // check if user exists or not
  const userInstance = new UserModel()
  if ((await userInstance.isUserExists(userId)) == null) {
    throw new Error('User not found')
  }

  const result = await UserModel.updateOne(
    { userId: userId },
    { $addToSet: { orders: productData } },
  )

  return result
}

export const UserServices = {
  createUserIntoDB,
  getAllUsersFromDB,
  getUserByIdFromDB,
  updateUserIntoDB,
  deleteUserIntoDB,
  createOrderByIdIntoDB,
}
