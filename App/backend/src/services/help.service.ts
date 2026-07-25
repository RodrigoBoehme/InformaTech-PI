import { AppError } from '../errors/AppError'
import { HelpStatus } from '../entities/HelpOffer'
import { UserRole } from '../entities/User'
import { HelpRepository } from '../repositories/help.repository'
import { RequestRepository } from '../repositories/request.repository'

interface Actor { id: string; role: UserRole }
interface CreateHelpInput { requestId: string; message: string }
interface UpdateHelpInput { message?: string; status?: HelpStatus }

/** Regras do CRUD de ofertas de ajuda. */
export class HelpService {
  constructor(
    private readonly helps = new HelpRepository(),
    private readonly requests = new RequestRepository(),
  ) {}

  list(requestId?: string) {
    return this.helps.findAll(requestId ? { requestId } : {})
  }

  async findById(id: string) {
    const help = await this.helps.findById(id)
    if (!help) throw new AppError('Oferta de ajuda não encontrada.', 404)
    return help
  }

  async create(input: CreateHelpInput, actor: Actor) {
    const request = await this.requests.findById(input.requestId)
    if (!request) throw new AppError('Pedido não encontrado.', 404)
    if (request.status !== 'OPEN') throw new AppError('Só é possível ajudar em pedidos abertos.', 400)

    const help = this.helps.create({
      requestId: input.requestId,
      message: input.message,
      volunteerId: actor.id,
    })
    return this.helps.save(help)
  }

  async update(id: string, input: UpdateHelpInput, actor: Actor) {
    const help = await this.findById(id)
    if (actor.role !== 'ADMIN' && help.volunteerId !== actor.id) throw new AppError('Sem permissão.', 403)
    this.helps.merge(help, input)
    return this.helps.save(help)
  }

  async delete(id: string, actor: Actor) {
    const help = await this.findById(id)
    if (actor.role !== 'ADMIN' && help.volunteerId !== actor.id) throw new AppError('Sem permissão.', 403)
    await this.helps.remove(help)
  }
}
