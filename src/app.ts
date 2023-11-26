import express, { Application } from 'express'
import cors from 'cors'
import { UserRouter } from './module/user/user.route'
const app: Application = express()

//middlewares
app.use(cors())
//parsers
app.use(express.json())

//routers
app.use('/api', UserRouter)

export default app