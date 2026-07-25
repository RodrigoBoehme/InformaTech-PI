import bcrypt from 'bcryptjs'
import { AppError } from '../errors/AppError'
import { UserRole } from '../entities/User'
import { UserRepository } from '../repositories/user.repository'
import { safeUser } from '../utils/safe-user'

interface AuthenticatedUser { id: string; role: UserRole }
interface UpdateUserInput {
  name?: string
  email?: string
  phone?: string
  role?: UserRole
  active?: boolean
  password?: string
}

/** Regras do CRUD de usuários e autorização das alterações. */
export class UserService {
  constructor(private readonly users = new UserRepository()) {}

  async list() {
    return (await this.users.findAll()).map(safeUser)
  }

  async findById(id: string) {
    const user = await this.users.findById(id)
    if (!user) throw new AppError('Usuário não encontrado.', 404)
    return safeUser(user)
  }

  async update(id: string, input: UpdateUserInput, actor: AuthenticatedUser) {
    const user = await this.users.findById(id)
    if (!user) throw new AppError('Usuário não encontrado.', 404)

    const isAdmin = actor.role === 'ADMIN'
    if (!isAdmin && actor.id !== id) throw new AppError('Sem permissão.', 403)

    // Somente administradores podem trocar perfil ou ativar/desativar contas.
    if (!isAdmin && (input.role !== undefined || input.active !== undefined)) {
      throw new AppError('Somente administradores podem alterar perfil ou situação.', 403)
    }

    if (input.email) {
      const email = input.email.trim().toLowerCase()
      const existing = await this.users.findByEmail(email)
      if (existing && existing.id !== id) throw new AppError('E-mail já cadastrado.', 409)
      user.email = email
    }

    if (input.name !== undefined) user.name = input.name.trim()
    if (input.phone !== undefined) user.phone = input.phone
    if (input.role !== undefined) user.role = input.role
    if (input.active !== undefined) user.active = input.active
    if (input.password) user.passwordHash = await bcrypt.hash(input.password, 12)

    return safeUser(await this.users.save(user))
  }

  async delete(id: string, actor: AuthenticatedUser) {
    const user = await this.users.findById(id)
    if (!user) throw new AppError('Usuário não encontrado.', 404)
    if (actor.id === id) throw new AppError('O administrador não pode excluir a própria conta.', 400)
    await this.users.remove(user)
  }
}
