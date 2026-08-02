import { Router } from 'express'
import { RiskZoneV2Controller } from '../controllers/risk-zone-v2.controller'
import { auth } from '../middlewares/auth'
import { allowRoles } from '../middlewares/roles'

export const riskZoneV2Routes = Router()
const controller = new RiskZoneV2Controller()

riskZoneV2Routes.get('/', controller.list)
riskZoneV2Routes.get('/:id', controller.show)
riskZoneV2Routes.post('/', auth, allowRoles('ADMIN'), controller.create)
riskZoneV2Routes.put('/:id', auth, allowRoles('ADMIN'), controller.update)
riskZoneV2Routes.delete('/:id', auth, allowRoles('ADMIN'), controller.delete)
