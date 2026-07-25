import { Router } from 'express'
import { login, profile, register } from '../controllers/auth.controller'
import { auth } from '../middlewares/auth'
import { validate } from '../middlewares/validate'
import { loginSchema, registerSchema } from '../schemas/auth.schema'

/** Rotas somente conectam URL, middlewares e controlador. */
export const authRoutes = Router()
authRoutes.post('/cadastro', validate(registerSchema), register)
authRoutes.post('/entrar', validate(loginSchema), login)
authRoutes.get('/perfil', auth, profile)
