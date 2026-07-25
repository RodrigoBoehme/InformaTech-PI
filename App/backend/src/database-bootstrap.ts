import mysql from 'mysql2/promise'
import { env } from './config/env'

/** Cria o banco configurado no .env quando ele ainda não existe. */
export async function ensureDatabaseExists() {
  const databaseName = env.dbName.replace(/`/g, '')
  const connection = await mysql.createConnection({
    host: env.dbHost,
    port: env.dbPort,
    user: env.dbUser,
    password: env.dbPassword,
  })

  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${databaseName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    )
  } finally {
    await connection.end()
  }
}
