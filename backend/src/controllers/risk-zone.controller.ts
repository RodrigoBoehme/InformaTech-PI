import { NextFunction, Request, Response } from 'express'
import { createRiskZoneSchema, updateRiskZoneSchema } from '../schemas/risk-zone.schema'
import { RiskZoneService } from '../services/risk-zone.service'

const service = new RiskZoneService()

export class RiskZoneController {
  async list(_req: Request, res: Response, next: NextFunction) {
    try { return res.json(await service.list()) } catch (error) { return next(error) }
  }

  async show(req: Request, res: Response, next: NextFunction) {
    try { return res.json(await service.findById(req.params.id)) } catch (error) { return next(error) }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const input = createRiskZoneSchema.parse(req.body)
      const zone = await service.create(input, req.user!.id)
      return res.status(201).json(zone)
    } catch (error) { return next(error) }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const input = updateRiskZoneSchema.parse(req.body)
      return res.json(await service.update(req.params.id, input))
    } catch (error) { return next(error) }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await service.delete(req.params.id)
      return res.status(204).send()
    } catch (error) { return next(error) }
  }
}
