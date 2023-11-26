import { Request, Response } from 'express'
import joiUserSchema from './user.validation'
import { UserServices } from './user.service'

const createUser = async (req: Request, res: Response) => {
  try {
    //get data from url request
    const userData = req.body

    //   data validation using Joi
    const { error, value } = joiUserSchema.validate(userData)
    if (error) {
      throw error.details
    }

    //send to services for doing query
    const result = await UserServices.createUserIntoDB(value)
    // remove password and orders property before sending response
    // result.orders = undefined
    // result.password = undefined
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

    //send back
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

export const UserControllers = {
  createUser,
}
