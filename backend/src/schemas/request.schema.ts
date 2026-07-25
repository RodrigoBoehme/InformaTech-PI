import { z } from 'zod'
export const createRequestSchema = z.object({
  title: z.string().min(3), description: z.string().min(5), category: z.string().min(3),
  priority: z.enum(['LOW','MEDIUM','HIGH','CRITICAL']).default('MEDIUM'),
  latitude: z.coerce.number().min(-90).max(90), longitude: z.coerce.number().min(-180).max(180),
  address: z.string().max(255).optional()
})
export const updateRequestSchema = createRequestSchema.partial().extend({ status: z.enum(['OPEN','IN_PROGRESS','RESOLVED','CANCELED']).optional() })
