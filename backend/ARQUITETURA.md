# Arquitetura do backend InformaTech

## Fluxo de uma requisição

```text
Cliente React Native
      ↓ HTTP/JSON
Route → Middleware → Controller → Service → Repository → TypeORM → MySQL
                              ↓
                        regra de negócio
```

## Responsabilidade de cada camada

- **routes**: associa método, URL, validação e controlador. Não contém regra de negócio.
- **middlewares**: autenticação JWT, autorização, validação Zod e tratamento de erros.
- **controllers**: adapta HTTP para o caso de uso. Lê `params`, `query`, `body` e devolve status/resposta.
- **services**: concentra regras de negócio, permissões e transições de estado.
- **repositories**: encapsula consultas e persistência TypeORM.
- **entities**: mapeia classes TypeScript para tabelas e relacionamentos MySQL.
- **schemas**: valida contratos de entrada com Zod.
- **config**: variáveis de ambiente, upload e Swagger/OpenAPI.

## Por que não acessar TypeORM no Controller?

Separar persistência da camada HTTP permite testar regras de negócio sem iniciar servidor,
evita repetição de consultas e reduz o acoplamento com Express e TypeORM.

## Domínios implementados

### Usuários

- cadastro e login;
- perfil autenticado;
- consulta, atualização e exclusão;
- perfis `REQUESTER`, `VOLUNTEER` e `ADMIN`;
- ativação/desativação administrativa;
- senha armazenada somente como hash bcrypt.

### Pedidos

- criação, listagem, detalhamento, atualização e exclusão;
- upload opcional de imagem;
- geolocalização;
- aceite por voluntário;
- conclusão por solicitante, voluntário responsável ou administrador.

### Ofertas de ajuda

- criação vinculada a um pedido aberto;
- listagem geral ou filtrada por pedido;
- detalhamento, atualização e exclusão;
- autorização por proprietário ou administrador.

## TypeORM

O `AppDataSource` configura MySQL, entidades e modo de sincronização. Em desenvolvimento,
`synchronize=true` facilita o primeiro uso. Em produção, configure `NODE_ENV=production`
e utilize migrations pelos scripts do `package.json`.
