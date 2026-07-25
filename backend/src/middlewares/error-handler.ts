import { NextFunction, Request, Response } from 'express'
import { QueryFailedError } from 'typeorm'
import { ZodError } from 'zod'
import { AppError } from '../errors/AppError'

/**
 * Tratamento centralizado: nenhuma camada precisa repetir try/catch de resposta.
 * Erros esperados recebem o status correto; erros desconhecidos retornam 500.
 */
export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message })
  }
  if (error instanceof ZodError) {
    return res.status(400).json({ message: 'Dados inválidos.', details: error.flatten() })
  }
  if (error instanceof QueryFailedError) {
    console.error('Erro de banco de dados:', error)
    return res.status(409).json({ message: 'A operação viola uma regra do banco de dados.' })
  }
  console.error('Erro não tratado:', error)
  return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' })
}
