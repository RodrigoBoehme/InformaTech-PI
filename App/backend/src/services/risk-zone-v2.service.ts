import { AppError } from '../errors/AppError'
import { FloodLevel, RiskZoneV2 } from '../entities/RiskZoneV2'
import { RiskZoneV2Repository } from '../repositories/risk-zone-v2.repository'
import { CreateRiskZoneV2Input, UpdateRiskZoneV2Input } from '../schemas/risk-zone-v2.schema'

export class RiskZoneV2Service {
  private readonly repository = new RiskZoneV2Repository()

  list() {
    return this.repository.findAll()
  }

  async findById(id: string) {
    const zone = await this.repository.findById(id)
    if (!zone) throw new AppError('Zona de risco não encontrada.', 404)
    return zone
  }

  create(input: CreateRiskZoneV2Input, adminId: string) {
    const zone = this.repository.create({
      name: input.name.trim(),
      description: input.description?.trim() || null,
      coords: input.coords.trim(),
      riverLevelMeters: Number(input.riverLevelMeters),
      floodLevel: input.floodLevel as FloodLevel,
      active: input.active ?? true,
      createdBy: adminId,
    })
    return this.repository.save(zone)
  }

  async update(id: string, input: UpdateRiskZoneV2Input) {
    const zone = await this.findById(id)
    if (input.name !== undefined) zone.name = input.name.trim()
    if (input.description !== undefined) zone.description = input.description?.trim() || null
    if (input.coords!== undefined) zone.coords = input.coords.trim()
    if (input.riverLevelMeters !== undefined) zone.riverLevelMeters = Number(input.riverLevelMeters)
    if (input.floodLevel !== undefined) zone.floodLevel = input.floodLevel as FloodLevel
    if (input.active !== undefined) zone.active = input.active
    return this.repository.save(zone)
  }

  async delete(id: string) {
    const zone = await this.findById(id)
    await this.repository.remove(zone)
  }
}
