import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { TokenPayload } from '../types/auth'

/** Acrescenta os dados do usuário autenticado ao objeto Request do Express. */
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload
    }
  }
}

/**
 * Valida o cabeçalho Authorization no formato "Bearer <token>".
 * O middleware não consulta o banco: ele apenas comprova a assinatura do JWT.
 */
export function auth(req: Request, res: Response, next: NextFunction) {
  const [scheme, token] = req.headers.authorization?.split(' ') ?? []

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Token de autenticação não informado.' })
  }

  try {
    req.user = jwt.verify(token, env.jwtSecret) as TokenPayload
    return next()
  } catch {
    return res.status(401).json({ message: 'Token expirado ou inválido.' })
  }
}
