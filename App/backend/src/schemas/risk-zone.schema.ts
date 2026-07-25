import { z } from 'zod'

const floodLevelSchema = z.enum(['BAIXO', 'MODERADO', 'ALTO', 'CRITICO'])

export const createRiskZoneSchema = z.object({
  name: z.string().trim().min(3, 'Informe um nome com pelo menos 3 caracteres.').max(120),
  description: z.string().trim().max(1000).optional().nullable(),
  latitude: z.coerce.number().finite().min(-90).max(90),
  longitude: z.coerce.number().finite().min(-180).max(180),
  radiusMeters: z.coerce.number().int().min(10, 'O raio mínimo é de 10 metros.').max(10000),
  riverLevelMeters: z.coerce.number().finite().min(0, 'O nível do rio não pode ser negativo.').max(100),
  floodLevel: floodLevelSchema,
  active: z.boolean().optional().default(true),
})

export const updateRiskZoneSchema = createRiskZoneSchema.partial()
export type CreateRiskZoneInput = z.infer<typeof createRiskZoneSchema>
export type UpdateRiskZoneInput = z.infer<typeof updateRiskZoneSchema>
