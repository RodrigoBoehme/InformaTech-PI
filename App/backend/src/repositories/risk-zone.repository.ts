import { Repository } from 'typeorm'
import { AppDataSource } from '../data-source'
import { RiskZone } from '../entities/RiskZone'

/** Encapsula todas as operações TypeORM relacionadas às zonas de risco. */
export class RiskZoneRepository {
  private get repository() :Repository<RiskZone>{
   return AppDataSource.getRepository(RiskZone)
  }
  create(data: Partial<RiskZone>):RiskZone { return this.repository.create(data) }
  save(zone: RiskZone) { return this.repository.save(zone) }
  findAll():Promise<RiskZone[]> { return this.repository.find({ order: { createdAt: 'DESC' } }) }
  findById(id: string):Promise<RiskZone|null> { return this.repository.findOne({ where: { id } }) }
  remove(zone: RiskZone){ return this.repository.remove(zone) }
}
