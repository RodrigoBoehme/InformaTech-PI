import { Router } from 'express'
import { upload } from '../config/upload'
import { acceptRequest, completeRequest, createRequest, deleteRequest, getRequest, listRequests, updateRequest } from '../controllers/request.controller'
import { auth } from '../middlewares/auth'
import { validate } from '../middlewares/validate'
import { createRequestSchema, updateRequestSchema } from '../schemas/request.schema'

export const requestRoutes = Router()
requestRoutes.use(auth)
requestRoutes.get('/', listRequests)
requestRoutes.get('/:id', getRequest)
requestRoutes.post('/', upload.single('image'), validate(createRequestSchema), createRequest)
requestRoutes.put('/:id', validate(updateRequestSchema), updateRequest)
requestRoutes.patch('/:id/aceitar', acceptRequest)
requestRoutes.patch('/:id/concluir', completeRequest)
requestRoutes.delete('/:id', deleteRequest)
