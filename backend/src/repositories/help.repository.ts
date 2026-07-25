import { FindOptionsWhere, Repository } from 'typeorm'
import { AppDataSource } from '../data-source'
import { HelpOffer } from '../entities/HelpOffer'

/** Repositório responsável pelas ofertas de ajuda. */
export class HelpRepository {
  private get repository(): Repository<HelpOffer> {
    return AppDataSource.getRepository(HelpOffer)
  }

  findAll(where: FindOptionsWhere<HelpOffer> = {}): Promise<HelpOffer[]> {
    return this.repository.find({ where, order: { createdAt: 'DESC' } })
  }

  findById(id: string): Promise<HelpOffer | null> {
    return this.repository.findOneBy({ id })
  }

  create(data: Partial<HelpOffer>): HelpOffer {
    return this.repository.create(data)
  }

  merge(entity: HelpOffer, data: Partial<HelpOffer>): HelpOffer {
    return this.repository.merge(entity, data)
  }

  save(entity: HelpOffer): Promise<HelpOffer> {
    return this.repository.save(entity)
  }

  async remove(entity: HelpOffer): Promise<void> {
    await this.repository.remove(entity)
  }
}
