import { Repository } from 'typeorm'
import { AppDataSource } from '../data-source'
import { RiskZoneV2 } from '../entities/RiskZoneV2'

/** Encapsula todas as operações TypeORM relacionadas às zonas de risco. */
export class RiskZoneV2Repository {
  private get repository() :Repository<RiskZoneV2>{
   return AppDataSource.getRepository(RiskZoneV2)
  }
  create(data: Partial<RiskZoneV2>):RiskZoneV2 { return this.repository.create(data) }
  save(zone: RiskZoneV2) { return this.repository.save(zone) }
  findAll():Promise<RiskZoneV2[]> { return this.repository.find({ order: { createdAt: 'DESC' } }) }
  findById(id: string):Promise<RiskZoneV2|null> { return this.repository.findOne({ where: { id } }) }
  remove(zone: RiskZoneV2){ return this.repository.remove(zone) }
}
