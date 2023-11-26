import { Model } from 'mongoose'

export type TFullName = {
  firstName: string
  lastName: string
}

export type TAddress = {
  street: string
  city: string
  country: string
}

export type TOrder = {
  productName: string
  price: number
  quantity: number
}

export interface IUser {
  userId: number
  username: string
  password: string
  fullName: TFullName
  age: number
  email: string
  isActive: boolean
  hobbies: [string]
  address: TAddress
  orders?: [TOrder]
}

export type TUserMethods = {
  // eslint-disable-next-line no-unused-vars
  isUserExists(userId: number): Promise<IUser | null>
}

export type TUserModel = Model<IUser, Record<string, never>, TUserMethods>
