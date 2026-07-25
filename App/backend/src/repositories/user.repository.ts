import { FindOptionsWhere, Repository } from 'typeorm'
import { AppDataSource } from '../data-source'
import { User } from '../entities/User'

/**
 * Repositório de usuários.
 *
 * Esta classe é a única camada que conhece os detalhes do TypeORM para User.
 * Services não executam SQL nem chamam AppDataSource diretamente, o que reduz
 * acoplamento e facilita testes unitários com repositórios simulados.
 */
export class UserRepository {
  private get repository(): Repository<User> {
    return AppDataSource.getRepository(User)
  }

  findAll(): Promise<User[]> {
    return this.repository.find({ order: { name: 'ASC' } })
  }

  findById(id: string): Promise<User | null> {
    return this.repository.findOneBy({ id })
  }

  findByEmail(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email: email.toLowerCase() })
  }

  findOne(where: FindOptionsWhere<User>): Promise<User | null> {
    return this.repository.findOneBy(where)
  }

  create(data: Partial<User>): User {
    return this.repository.create(data)
  }

  save(user: User): Promise<User> {
    return this.repository.save(user)
  }

  async remove(user: User): Promise<void> {
    await this.repository.remove(user)
  }
}
