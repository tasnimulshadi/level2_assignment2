import { Model } from 'mongoose'

export type TOrder = {
  productName: string
  price: number
  quantity: number
}

export interface IUser {
  userId: number
  username: string
  password: string
  fullName: {
    firstName: string
    lastName: string
  }
  age: number
  email: string
  isActive: boolean
  hobbies: [string]
  address: {
    street: string
    city: string
    country: string
  }
  orders?: [TOrder]
  isDeleted: boolean
}

export type TUserMethods = {
  // eslint-disable-next-line no-unused-vars
  isUserExists(userId: number): Promise<IUser | null>
}

export type TUserModel = Model<IUser, Record<string, never>, TUserMethods>
