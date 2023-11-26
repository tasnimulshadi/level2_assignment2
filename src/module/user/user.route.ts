import express from 'express'
import { UserControllers } from './user.controller'

const router = express.Router()

router.post('/users', UserControllers.createUser)
// router.get('/', StudentControllers.getAllStudents)
// router.get('/:studentId', StudentControllers.getOneStudentById)

export const UserRouter = router
