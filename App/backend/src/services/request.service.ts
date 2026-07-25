import { AppError } from '../errors/AppError'
import { RequestPriority, RequestStatus } from '../entities/RescueRequest'
import { UserRole } from '../entities/User'
import { RequestRepository } from '../repositories/request.repository'

interface Actor { id: string; role: UserRole }
interface CreateRequestInput {
  title: string; description: string; category: string; priority: RequestPriority
  latitude: number; longitude: number; address?: string; imageUrl?: string
}
interface UpdateRequestInput extends Partial<CreateRequestInput> { status?: RequestStatus }

/** Regras de criação, acompanhamento e conclusão de pedidos. */
export class RequestService {
  constructor(private readonly requests = new RequestRepository()) {}

  list(actor: Actor, onlyMine: boolean) {
    return this.requests.findAll(onlyMine ? { requesterId: actor.id } : {})
  }

  async findById(id: string) {
    const request = await this.requests.findById(id, true)
    if (!request) throw new AppError('Pedido não encontrado.', 404)
    return request
  }

  async create(input: CreateRequestInput, actor: Actor) {
    const request = this.requests.create({ ...input, requesterId: actor.id })
    return this.requests.save(request)
  }

  async update(id: string, input: UpdateRequestInput, actor: Actor) {
    const request = await this.findEntity(id)
    if (actor.role !== 'ADMIN' && request.requesterId !== actor.id) {
      throw new AppError('Sem permissão para editar este pedido.', 403)
    }
    this.requests.merge(request, input)
    return this.requests.save(request)
  }

  async accept(id: string, actor: Actor) {
    if (!['VOLUNTEER', 'ADMIN'].includes(actor.role)) {
      throw new AppError('Apenas voluntários ou administradores podem aceitar pedidos.', 403)
    }
    const request = await this.findEntity(id)
    if (request.status !== 'OPEN') throw new AppError('Este pedido não está aberto.', 400)
    request.status = 'IN_PROGRESS'
    request.volunteerId = actor.id
    return this.requests.save(request)
  }

  async complete(id: string, actor: Actor) {
    const request = await this.findEntity(id)
    const allowed = actor.role === 'ADMIN' || request.volunteerId === actor.id || request.requesterId === actor.id
    if (!allowed) throw new AppError('Sem permissão para concluir este pedido.', 403)
    request.status = 'RESOLVED'
    return this.requests.save(request)
  }

  async delete(id: string, actor: Actor) {
    const request = await this.findEntity(id)
    if (actor.role !== 'ADMIN' && request.requesterId !== actor.id) {
      throw new AppError('Sem permissão para excluir este pedido.', 403)
    }
    await this.requests.remove(request)
  }

  private async findEntity(id: string) {
    const request = await this.requests.findById(id)
    if (!request) throw new AppError('Pedido não encontrado.', 404)
    return request
  }
}
