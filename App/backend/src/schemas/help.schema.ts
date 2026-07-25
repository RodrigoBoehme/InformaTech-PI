import { z } from 'zod'
export const createHelpSchema = z.object({ requestId: z.string().uuid(), message: z.string().min(5).max(500) })
export const updateHelpSchema = z.object({ message: z.string().min(5).max(500).optional(), status: z.enum(['OFFERED','ACCEPTED','COMPLETED','CANCELED']).optional() })
