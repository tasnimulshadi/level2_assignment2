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
    // stage 1 - output (username, fullName, age, email, address)
    {
      $project: {
        username: 1,
        fullName: 1,
        age: 1,
        email: 1,
        address: 1,
        _id: 0,
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

  const result = await UserModel.findOne(
    {
      userId: userId,
    },
    {
      password: 0,
      _id: 0,
      isDeleted: 0,
      orders: 0,
      __v: 0,
    },
  )
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

// Retrieve all orders for a specific user
const getOrdersByUserIdFromDB = async (userId: number) => {
  // check if user exists or not
  const userInstance = new UserModel()
  if ((await userInstance.isUserExists(userId)) == null) {
    throw new Error('User not found')
  }

  const result = await UserModel.findOne(
    {
      userId: { $eq: userId },
    },
    {
      orders: 1,
      _id: 0,
    },
  )
  return result
}

// Calculate Total Price of Orders for a Specific User
const getOrdersTotalPriceFromDB = async (userId: number) => {
  // check if user exists or not
  const userInstance = new UserModel()
  if ((await userInstance.isUserExists(userId)) == null) {
    throw new Error('User not found')
  }

  // query
  const result = await UserModel.findOne(
    {
      userId: { $eq: userId },
    },
    {
      orders: 1,
    },
  )

  // sum orders
  let total: number = 0
  if (result && result.orders && result.orders.length > 0) {
    const sum = result.orders.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.price * currentValue.quantity,
      0,
    )

    total = parseFloat(sum.toFixed(2))
  }

  return { totalPrice: total }
}

// export
export const UserServices = {
  createUserIntoDB,
  getAllUsersFromDB,
  getUserByIdFromDB,
  updateUserIntoDB,
  deleteUserIntoDB,
  createOrderByIdIntoDB,
  getOrdersByUserIdFromDB,
  getOrdersTotalPriceFromDB,
}
