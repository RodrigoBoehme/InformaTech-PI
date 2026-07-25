import bcrypt from 'bcryptjs'
import jwt, { SignOptions } from 'jsonwebtoken'

import { env } from '../config/env'
import { AppError } from '../errors/AppError'
import { UserRole } from '../entities/User'
import { UserRepository } from '../repositories/user.repository'
import { safeUser } from '../utils/safe-user'

interface RegisterInput {
  name: string
  email: string
  password: string
  phone: string
  role: Exclude<UserRole, 'ADMIN'>
}

interface LoginInput {
  email: string
  password: string
}

/** Regras de negócio relacionadas ao cadastro, login e perfil autenticado. */
export class AuthService {
  constructor(private readonly users = new UserRepository()) {}

  async register(input: RegisterInput) {
    const email = input.email.trim().toLowerCase()

    if (await this.users.findByEmail(email)) {
      throw new AppError('E-mail já cadastrado.', 409)
    }

    const user = this.users.create({
      name: input.name.trim(),
      email,
      phone: input.phone,
      role: input.role,
      passwordHash: await bcrypt.hash(input.password, 12),
    })

    return safeUser(await this.users.save(user))
  }

  async login(input: LoginInput) {
    const email = input.email.trim().toLowerCase()

    const user = await this.users.findByEmail(email)

    const passwordMatches = user
      ? await bcrypt.compare(input.password, user.passwordHash)
      : false

    if (!user || !user.active || !passwordMatches) {
      throw new AppError('E-mail ou senha inválidos.', 401)
    }

    const tokenOptions: SignOptions = {
      expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'],
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      env.jwtSecret,
      tokenOptions,
    )

    return {
      token,
      user: safeUser(user),
    }
  }

  async profile(userId: string) {
    const user = await this.users.findById(userId)

    if (!user) {
      throw new AppError('Usuário não encontrado.', 404)
    }

    return safeUser(user)
  }
}