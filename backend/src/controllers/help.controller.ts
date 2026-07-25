import { NextFunction, Request, Response } from 'express'
import { HelpService } from '../services/help.service'

const service = new HelpService()

export async function listHelpOffers(req: Request, res: Response, next: NextFunction) {
  try { return res.json(await service.list(req.query.requestId ? String(req.query.requestId) : undefined)) } catch (error) { return next(error) }
}
export async function getHelpOffer(req: Request, res: Response, next: NextFunction) {
  try { return res.json(await service.findById(req.params.id)) } catch (error) { return next(error) }
}
export async function createHelpOffer(req: Request, res: Response, next: NextFunction) {
  try { return res.status(201).json(await service.create(req.body, req.user!)) } catch (error) { return next(error) }
}
export async function updateHelpOffer(req: Request, res: Response, next: NextFunction) {
  try { return res.json(await service.update(req.params.id, req.body, req.user!)) } catch (error) { return next(error) }
}
export async function deleteHelpOffer(req: Request, res: Response, next: NextFunction) {
  try { await service.delete(req.params.id, req.user!); return res.status(204).send() } catch (error) { return next(error) }
}
