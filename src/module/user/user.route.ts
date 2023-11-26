import express from 'express'
import { UserControllers } from './user.controller'

const router = express.Router()

// Create a new user
router.post('/users', UserControllers.createUser)
// Retrieve a list of all users
router.get('/users', UserControllers.getAllUsers)

// router.get('/:studentId', StudentControllers.getOneStudentById)

export const UserRouter = router
