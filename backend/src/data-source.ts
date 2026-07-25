import 'reflect-metadata'
import { DataSource } from 'typeorm'

import { env } from './config/env'
import { HelpOffer } from './entities/HelpOffer'
import { RescueRequest } from './entities/RescueRequest'
import { User } from './entities/User'
import { RiskZone } from './entities/RiskZone'

/**
 * Conexão central com o MySQL usando TypeORM.
 *
 * Nesta versão didática não utilizamos migrations. A opção `synchronize: true`
 * faz o TypeORM comparar as entidades com o banco e criar/ajustar as tabelas
 * automaticamente quando o backend inicia.
 *
 * Isso simplifica bastante a execução durante estudos e apresentações. Em um
 * sistema real publicado, alterações automáticas de schema exigem mais cuidado.
 */
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: env.dbHost,
  port: env.dbPort,
  username: env.dbUser,
  password: env.dbPassword,
  database: env.dbName,

  // Cria e atualiza as tabelas com base nas entidades, sem migrations.
  synchronize: false,

  // Exibe as consultas SQL apenas no ambiente de desenvolvimento.
  logging: env.nodeEnv === 'development',

  entities: [User, RescueRequest, HelpOffer, RiskZone],
})
