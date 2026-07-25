import { NextFunction, Request, Response } from 'express'
import { UserService } from '../services/user.service'

const service = new UserService()

export async function listUsers(_req: Request, res: Response, next: NextFunction) {
  try { return res.json(await service.list()) } catch (error) { return next(error) }
}
export async function getUser(req: Request, res: Response, next: NextFunction) {
  try { return res.json(await service.findById(req.params.id)) } catch (error) { return next(error) }
}
export async function updateUser(req: Request, res: Response, next: NextFunction) {
  try { return res.json(await service.update(req.params.id, req.body, req.user!)) } catch (error) { return next(error) }
}
export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try { await service.delete(req.params.id, req.user!); return res.status(204).send() } catch (error) { return next(error) }
}
