# Documentação Swagger/OpenAPI

A API possui documentação interativa completa em Swagger UI.

## Como acessar

1. Configure o arquivo `.env` do backend.
2. Inicie a API:

```bash
npm install
npm run dev
```

3. Abra no navegador:

```text
http://localhost:3333/documentacao
```

A especificação OpenAPI em JSON está disponível em:

```text
http://localhost:3333/documentacao/openapi.json
```

## Como autenticar

1. Use `POST /autenticacao/cadastro` para criar uma conta.
2. Use `POST /autenticacao/entrar` para obter o JWT.
3. Copie o valor de `token` da resposta.
4. Clique em **Authorize** no topo do Swagger.
5. Cole somente o token, sem escrever `Bearer`.
6. Confirme em **Authorize**.

O Swagger adicionará automaticamente:

```http
Authorization: Bearer SEU_TOKEN_JWT
```

## Recursos documentados

- Status da API;
- Cadastro e login;
- Perfil autenticado;
- CRUD de usuários;
- CRUD de pedidos;
- Aceite e conclusão de pedidos;
- CRUD de ofertas de ajuda;
- Upload opcional de imagem;
- Perfis `REQUESTER`, `VOLUNTEER` e `ADMIN`;
- Respostas de validação, autenticação, permissão e recurso não encontrado.

## Arquivos principais

```text
src/config/swagger.ts     Especificação OpenAPI 3.0.3
src/config/swagger-ui.ts  Página do Swagger UI
src/server.ts             Rotas /documentacao e /documentacao/openapi.json
```

## Observação sobre o Swagger UI

Os arquivos visuais do Swagger UI são carregados pelo CDN `jsDelivr`. A API e o arquivo OpenAPI permanecem locais. Portanto, a máquina precisa ter acesso à internet para carregar a interface visual. A especificação JSON funciona normalmente mesmo sem o CDN.

- CRUD de zonas de risco, com escrita exclusiva para administradores.
