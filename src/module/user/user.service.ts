import { IUser } from './user.interface'
import { UserModel } from './user.model'

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
  const userInstance = new UserModel()

  const result = await userInstance.isUserExists(userId)
  if (result == null) {
    throw new Error('User not found')
  } else {
    return result
  }
}

export const UserServices = {
  createUserIntoDB,
  getAllUsersFromDB,
  getUserByIdFromDB,
}
