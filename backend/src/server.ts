import 'reflect-metadata'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import path from 'path'
import { env } from './config/env'
import { AppDataSource } from './data-source'
import { ensureDatabaseExists } from './database-bootstrap'
import { errorHandler } from './middlewares/error-handler'
import { authRoutes } from './routes/auth.routes'
import { requestRoutes } from './routes/request.routes'
import { userRoutes } from './routes/user.routes'
import { helpRoutes } from './routes/help.routes'
import { riskZoneRoutes } from './routes/risk-zone.routes'
import { swaggerDocument } from './config/swagger'
import { swaggerHtml } from './config/swagger-ui'

const app = express()
app.use(helmet({ crossOriginResourcePolicy: false, contentSecurityPolicy: false }))
app.use(cors())
app.use(express.json({ limit: '2mb' }))
app.use('/uploads', express.static(path.resolve(env.uploadDir)))
app.get('/', (_req, res) => res.redirect('/documentacao'))
app.get('/status', (_req, res) => res.json({ status: 'online', servico: 'API InformaTech', banco: AppDataSource.isInitialized ? 'conectado' : 'desconectado' }))
app.get('/documentacao/openapi.json', (_req, res) => res.json(swaggerDocument))
app.get('/documentacao', (_req, res) => res.type('html').send(swaggerHtml('/documentacao/openapi.json')))
app.use('/autenticacao', authRoutes)
app.use('/usuarios', userRoutes)
app.use('/pedidos', requestRoutes)
app.use('/ajudas', helpRoutes)
app.use('/zonas-risco', riskZoneRoutes)
app.use(errorHandler)

async function startServer() {
  try {
    await ensureDatabaseExists()
    await AppDataSource.initialize()

    app.listen(env.port, '0.0.0.0', () => {
      console.log(`API disponível na porta ${env.port}`)
      console.log(`Banco MySQL conectado: ${env.dbName}`)
      console.log(`Swagger: http://localhost:${env.port}/documentacao`)
    })
  } catch (error) {
    console.error('Não foi possível iniciar a API ou conectar ao MySQL.')
    console.error(error)
    process.exit(1)
  }
}

void startServer()

