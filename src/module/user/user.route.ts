import express from 'express'
import { UserControllers } from './user.controller'

const router = express.Router()

// Create a new user
router.post('/users', UserControllers.createUser)
// Retrieve a list of all users
router.get('/users', UserControllers.getAllUsers)
// Retrieve a specific user by ID
router.get('/users/:userId', UserControllers.getUserById)
// Update user information
router.put('/users/:userId', UserControllers.updateUser)
// Delete a user
router.delete('/users/:userId', UserControllers.deleteUser)

// Add New Product in Order
router.put('/users/:userId/orders', UserControllers.createOrder)
// Retrieve all orders for a specific user
router.get('/users/:userId/orders', UserControllers.getOrdersByUserId)
// Calculate Total Price of Orders for a Specific User
router.get(
  '/users/:userId/orders/total-price',
  UserControllers.getOrdersTotalPrice,
)

export const UserRouter = router
