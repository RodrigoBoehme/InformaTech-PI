import 'reflect-metadata'
import bcrypt from 'bcryptjs'
import { AppDataSource } from '../data-source'
import { User } from '../entities/User'

/**
 * Cria ou atualiza uma conta administrativa local.
 * Uso: defina ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD e ADMIN_PHONE no .env
 * e execute `npm run create-admin`.
 */
async function main() {
  await AppDataSource.initialize()
  const users = AppDataSource.getRepository(User)
  const email = (process.env.ADMIN_EMAIL || 'admin@informatech.com').trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD || 'Admin@123'
  let user = await users.findOne({ where: { email } })
  if (!user) user = users.create({ name: process.env.ADMIN_NAME || 'Administrador', email, phone: process.env.ADMIN_PHONE || '00000000000', passwordHash: '', role: 'ADMIN', active: true })
  user.role = 'ADMIN'; user.active = true; user.passwordHash = await bcrypt.hash(password, 12)
  await users.save(user)
  console.log(`Administrador pronto: ${email}`)
  await AppDataSource.destroy()
}
main().catch(error => { console.error(error); process.exit(1) })
