import 'dotenv/config'
import type { SignOptions } from 'jsonwebtoken'

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3000),
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: Number(process.env.DB_PORT || 3306),
  dbUser: process.env.DB_USER || 'root',
  dbPassword: process.env.DB_PASSWORD || 'root',
  dbName: process.env.DB_NAME || 'informatech_PI',
  jwtSecret: process.env.JWT_SECRET || 'troque-esta-chave-em-producao',
  jwtExpiresIn: (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'],
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
}
