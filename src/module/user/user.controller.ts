import { Request, Response } from 'express'
import joiUserSchema from './user.validation'
import { UserServices } from './user.service'
// import { IUser } from './user.interface'

// Create a new user
const createUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body

    // data validation using Joi
    const { error, value } = joiUserSchema.validate(userData)
    if (error) {
      throw error.details
    }

    const result = await UserServices.createUserIntoDB(value)

    // remove password and orders property before sending response
    const {
      userId,
      username,
      fullName,
      age,
      email,
      isActive,
      hobbies,
      address,
    } = result

    const newData = {
      userId,
      username,
      fullName,
      age,
      email,
      isActive,
      hobbies,
      address,
    }

    res.status(200).json({
      success: true,
      message: 'User created successfully!',
      data: newData,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'User creation failed!',
      error: error,
    })
  }
}

// Retrieve a list of all users
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await UserServices.getAllUsersFromDB()

    res.status(200).json({
      success: true,
      message: 'Users fetched successfully!',
      data: result,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Users fetching failed!',
      error: error,
    })
  }
}

// Retrieve a specific user by ID
const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params

    const result = await UserServices.getUserByIdFromDB(parseInt(userId))

    res.status(200).json({
      success: true,
      message: 'User fetched successfully!',
      data: result,
    })
  } catch (error) {
    res.status(404).json({
      success: false,
      message: 'User not found',
      error: {
        code: 404,
        description: 'User not found!',
      },
    })
  }
}

// Update user information
const updateUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body
    const { userId } = req.params

    // data validation using Joi
    const { error, value } = joiUserSchema.validate(userData)
    if (error) {
      throw error.details
    }

    const result = await UserServices.updateUserIntoDB(parseInt(userId), value)
    let updatedData

    if (result.modifiedCount === 1) {
      const {
        userId,
        username,
        fullName,
        age,
        email,
        isActive,
        hobbies,
        address,
      } = userData

      updatedData = {
        userId,
        username,
        fullName,
        age,
        email,
        isActive,
        hobbies,
        address,
      }

      res.status(200).json({
        success: true,
        message: 'User updated successfully!',
        data: updatedData,
      })
    }

    // res.status(200).json({
    //   success: true,
    //   message: 'User updated successfully!',
    //   data: result,
    // })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: 'User not found',
      error: {
        code: 404,
        description: 'User not found!',
      },
    })
  }
}

export const UserControllers = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
}
