import { NextFunction, Request, Response } from 'express'
import { RequestService } from '../services/request.service'

const service = new RequestService()

export async function listRequests(req: Request, res: Response, next: NextFunction) {
  try { return res.json(await service.list(req.user!, req.query.meus === 'true')) } catch (error) { return next(error) }
}
export async function getRequest(req: Request, res: Response, next: NextFunction) {
  try { return res.json(await service.findById(req.params.id)) } catch (error) { return next(error) }
}
export async function createRequest(req: Request, res: Response, next: NextFunction) {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined
    return res.status(201).json(await service.create({ ...req.body, imageUrl }, req.user!))
  } catch (error) { return next(error) }
}
export async function updateRequest(req: Request, res: Response, next: NextFunction) {
  try { return res.json(await service.update(req.params.id, req.body, req.user!)) } catch (error) { return next(error) }
}
export async function acceptRequest(req: Request, res: Response, next: NextFunction) {
  try { return res.json(await service.accept(req.params.id, req.user!)) } catch (error) { return next(error) }
}
export async function completeRequest(req: Request, res: Response, next: NextFunction) {
  try { return res.json(await service.complete(req.params.id, req.user!)) } catch (error) { return next(error) }
}
export async function deleteRequest(req: Request, res: Response, next: NextFunction) {
  try { await service.delete(req.params.id, req.user!); return res.status(204).send() } catch (error) { return next(error) }
}
