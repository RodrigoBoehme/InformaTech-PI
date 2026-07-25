import { Router } from 'express'
import { RiskZoneController } from '../controllers/risk-zone.controller'
import { auth } from '../middlewares/auth'
import { allowRoles } from '../middlewares/roles'

export const riskZoneRoutes = Router()
const controller = new RiskZoneController()

riskZoneRoutes.get('/', controller.list)
riskZoneRoutes.get('/:id', controller.show)
riskZoneRoutes.post('/', auth, allowRoles('ADMIN'), controller.create)
riskZoneRoutes.put('/:id', auth, allowRoles('ADMIN'), controller.update)
riskZoneRoutes.delete('/:id', auth, allowRoles('ADMIN'), controller.delete)
