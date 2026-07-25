import { NextFunction, Request, Response } from 'express'
import { UserRole } from '../entities/User'
export function allowRoles(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role as UserRole)) return res.status(403).json({ message: 'Você não tem permissão para esta ação.' })
    next()
  }
}
