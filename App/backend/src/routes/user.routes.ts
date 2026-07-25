import { Router } from 'express'
import { auth } from '../middlewares/auth'
import { allowRoles } from '../middlewares/roles'
import { validate } from '../middlewares/validate'
import { updateUserSchema } from '../schemas/user.schema'
import { deleteUser, getUser, listUsers, updateUser } from '../controllers/user.controller'
export const userRoutes = Router()
userRoutes.use(auth)
userRoutes.get('/', allowRoles('ADMIN'), listUsers)
userRoutes.get('/:id', getUser)
userRoutes.put('/:id', validate(updateUserSchema), updateUser)
userRoutes.delete('/:id', allowRoles('ADMIN'), deleteUser)
