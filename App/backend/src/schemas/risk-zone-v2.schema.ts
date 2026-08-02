import { z } from 'zod'

const floodLevelSchema = z.enum(['BAIXO', 'MODERADO', 'ALTO', 'CRITICO'])

export const createRiskZoneV2Schema = z.object({
  name: z.string().trim().min(3, 'Informe um nome com pelo menos 3 caracteres.').max(120),
  description: z.string().trim().max(1000).optional().nullable(),
  coords: z.string().trim().max(1000),
  riverLevelMeters: z.coerce.number().finite().min(0, 'O nível do rio não pode ser negativo.').max(100),
  floodLevel: floodLevelSchema,
  active: z.boolean().optional().default(true),
})

export const updateRiskZoneV2Schema = createRiskZoneV2Schema.partial()
export type CreateRiskZoneV2Input = z.infer<typeof createRiskZoneV2Schema>
export type UpdateRiskZoneV2Input = z.infer<typeof updateRiskZoneV2Schema>
