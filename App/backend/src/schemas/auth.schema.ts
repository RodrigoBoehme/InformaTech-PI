import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().min(8),
  role: z.enum(['REQUESTER', 'VOLUNTEER']).default('REQUESTER')
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})
