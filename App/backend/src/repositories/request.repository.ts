import { FindOptionsWhere, Repository } from 'typeorm'
import { AppDataSource } from '../data-source'
import { RescueRequest } from '../entities/RescueRequest'

/** Repositório responsável pela persistência e consultas dos pedidos. */
export class RequestRepository {
  private get repository(): Repository<RescueRequest> {
    return AppDataSource.getRepository(RescueRequest)
  }

  findAll(where: FindOptionsWhere<RescueRequest> = {}): Promise<RescueRequest[]> {
    return this.repository.find({ where, order: { createdAt: 'DESC' } })
  }

  findById(id: string, withHelpOffers = false): Promise<RescueRequest | null> {
    return this.repository.findOne({
      where: { id },
      relations: withHelpOffers ? { helpOffers: true } : undefined,
    })
  }

  create(data: Partial<RescueRequest>): RescueRequest {
    return this.repository.create(data)
  }

  merge(entity: RescueRequest, data: Partial<RescueRequest>): RescueRequest {
    return this.repository.merge(entity, data)
  }

  save(entity: RescueRequest): Promise<RescueRequest> {
    return this.repository.save(entity)
  }

  async remove(entity: RescueRequest): Promise<void> {
    await this.repository.remove(entity)
  }
}
