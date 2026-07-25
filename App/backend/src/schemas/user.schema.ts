import { z } from 'zod'
export const updateUserSchema = z.object({
  name: z.string().min(3).optional(), email: z.string().email().optional(),
  phone: z.string().min(8).optional(), role: z.enum(['REQUESTER', 'VOLUNTEER', 'ADMIN']).optional(),
  active: z.boolean().optional(), password: z.string().min(6).optional()
})
