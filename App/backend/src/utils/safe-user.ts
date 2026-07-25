import { User } from '../entities/User'
export function safeUser(user: User) {
  const { passwordHash, ...safe } = user
  return safe
}
