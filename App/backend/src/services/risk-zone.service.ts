import { AppError } from '../errors/AppError'
import { FloodLevel, RiskZone } from '../entities/RiskZone'
import { RiskZoneRepository } from '../repositories/risk-zone.repository'
import { CreateRiskZoneInput, UpdateRiskZoneInput } from '../schemas/risk-zone.schema'

export class RiskZoneService {
  private readonly repository = new RiskZoneRepository()

  list() {
    return this.repository.findAll()
  }

  async findById(id: string) {
    const zone = await this.repository.findById(id)
    if (!zone) throw new AppError('Zona de risco não encontrada.', 404)
    return zone
  }

  create(input: CreateRiskZoneInput, adminId: string) {
    const zone = this.repository.create({
      name: input.name.trim(),
      description: input.description?.trim() || null,
      latitude: Number(input.latitude),
      longitude: Number(input.longitude),
      radiusMeters: Math.round(Number(input.radiusMeters)),
      riverLevelMeters: Number(input.riverLevelMeters),
      floodLevel: input.floodLevel as FloodLevel,
      active: input.active ?? true,
      createdBy: adminId,
    })
    return this.repository.save(zone)
  }

  async update(id: string, input: UpdateRiskZoneInput) {
    const zone = await this.findById(id)
    if (input.name !== undefined) zone.name = input.name.trim()
    if (input.description !== undefined) zone.description = input.description?.trim() || null
    if (input.latitude !== undefined) zone.latitude = Number(input.latitude)
    if (input.longitude !== undefined) zone.longitude = Number(input.longitude)
    if (input.radiusMeters !== undefined) zone.radiusMeters = Math.round(Number(input.radiusMeters))
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
