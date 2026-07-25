# InformaTech API — versão intermediária sem migrations

Backend didático e profissional desenvolvido com Node.js, Express, TypeScript,
TypeORM, MySQL, JWT, bcrypt, Zod e Swagger/OpenAPI.

## Arquitetura

```text
Rota → Middleware → Controller → Service → Repository → TypeORM → MySQL
```

- **Routes:** registram os endpoints.
- **Middlewares:** autenticação, autorização, validação e erros.
- **Controllers:** recebem a requisição e devolvem a resposta HTTP.
- **Services:** concentram as regras de negócio.
- **Repositories:** isolam o acesso ao banco com TypeORM.
- **Entities:** representam as tabelas e relacionamentos.
- **Schemas:** validam entradas com Zod.

## Sem migrations

Este projeto usa `synchronize: true` no arquivo `src/data-source.ts`. Ao iniciar o
backend, o TypeORM cria e atualiza automaticamente as tabelas com base nas entidades.
Não é necessário executar nenhum comando de migration.

## Como executar

1. Crie o banco vazio:

```sql
CREATE DATABASE informatech CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Copie `.env.example` para `.env` e ajuste usuário e senha do MySQL.

3. Instale e execute:

```bash
npm install --no-audit --no-fund
npm run dev
```

4. Abra:

- API: `http://localhost:3333`
- Swagger: `http://localhost:3333/documentacao`
- OpenAPI JSON: `http://localhost:3333/documentacao/openapi.json`

## Scripts

```bash
npm run dev      # desenvolvimento
npm run build    # compila TypeScript
npm start        # executa a versão compilada
```

## Recursos

- cadastro e login com JWT;
- CRUD de usuários;
- CRUD de pedidos;
- CRUD de ofertas de ajuda;
- upload opcional de imagem;
- perfis de acesso;
- validações com Zod;
- documentação Swagger;
- tratamento centralizado de erros.
