import { NextFunction, Request, Response } from 'express'
import { AuthService } from '../services/auth.service'

const service = new AuthService()

/** Controlador HTTP: recebe os dados, chama o Service e define a resposta. */
export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    return res.status(201).json(await service.register(req.body))
  } catch (error) { return next(error) }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    return res.json(await service.login(req.body))
  } catch (error) { return next(error) }
}

export async function profile(req: Request, res: Response, next: NextFunction) {
  try {
    return res.json(await service.profile(req.user!.id))
  } catch (error) { return next(error) }
}
