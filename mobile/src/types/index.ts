export type Perfil = 'REQUESTER' | 'VOLUNTEER' | 'ADMIN'
export type Usuario = { id: string; name: string; email: string; phone: string; role: Perfil; active: boolean }
export type Pedido = { id: string; title: string; description: string; category: string; priority: 'LOW'|'MEDIUM'|'HIGH'|'CRITICAL'; status: 'OPEN'|'IN_PROGRESS'|'RESOLVED'|'CANCELED'; latitude: number|string; longitude: number|string; address?: string; requesterId: string; volunteerId?: string; requester?: Usuario; volunteer?: Usuario }
export type Ajuda = { id: string; message: string; status: 'OFFERED'|'ACCEPTED'|'COMPLETED'|'CANCELED'; requestId: string; volunteerId: string; volunteer?: Usuario }

export type NivelInundacao = 'BAIXO'|'MODERADO'|'ALTO'|'CRITICO'
export type ZonaRisco = {
  id: string
  name: string
  description?: string | null
  latitude: number | string
  longitude: number | string
  radiusMeters: number | string
  riverLevelMeters: number | string
  floodLevel: NivelInundacao
  active: boolean
  createdBy?: string | null
}
