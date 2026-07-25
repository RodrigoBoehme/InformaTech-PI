import { UserRole } from '../entities/User'

/** Conteúdo gravado dentro do token JWT da aplicação. */
export interface TokenPayload {
  id: string
  role: UserRole
}
