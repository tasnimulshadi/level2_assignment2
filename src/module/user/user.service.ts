import { IUser } from './user.interface'
import { UserModel } from './user.model'

const createUserIntoDB = async (userData: IUser) => {
  const result = await UserModel.create(userData)
  return result
}

export const UserServices = {
  createUserIntoDB,
}
