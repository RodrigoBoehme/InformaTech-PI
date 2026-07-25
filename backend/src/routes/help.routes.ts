import { Router } from 'express'
import { createHelpOffer, deleteHelpOffer, getHelpOffer, listHelpOffers, updateHelpOffer } from '../controllers/help.controller'
import { auth } from '../middlewares/auth'
import { allowRoles } from '../middlewares/roles'
import { validate } from '../middlewares/validate'
import { createHelpSchema, updateHelpSchema } from '../schemas/help.schema'

export const helpRoutes = Router()
helpRoutes.use(auth)
helpRoutes.get('/', listHelpOffers)
helpRoutes.get('/:id', getHelpOffer)
helpRoutes.post('/', allowRoles('VOLUNTEER', 'ADMIN'), validate(createHelpSchema), createHelpOffer)
helpRoutes.put('/:id', validate(updateHelpSchema), updateHelpOffer)
helpRoutes.delete('/:id', deleteHelpOffer)
