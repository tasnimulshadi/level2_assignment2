import { Request, Response } from 'express'
import joiUserSchema from './user.validation'
import { UserServices } from './user.service'

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
      message: error.message || 'failed',
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
      message: 'failed',
      error: error,
    })
  }
}

export const UserControllers = {
  createUser,
  getAllUsers
}
