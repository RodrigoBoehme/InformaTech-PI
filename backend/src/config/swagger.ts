import { env } from './env'

const servidorLocal = `http://localhost:${env.port}`

export const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'API InformaTech',
    version: '1.1.0',
    description: `
API REST para gerenciamento de usuários, pedidos de auxílio e ofertas de ajuda.

## Autenticação
1. Cadastre um usuário em **POST /autenticacao/cadastro**.
2. Realize o login em **POST /autenticacao/entrar**.
3. Copie o token retornado.
4. Clique em **Authorize** e informe somente o token JWT.

A interface adicionará automaticamente o prefixo \`Bearer\` ao cabeçalho Authorization.

## Perfis de acesso
- **REQUESTER**: cria e gerencia os próprios pedidos.
- **VOLUNTEER**: oferece ajuda e pode aceitar pedidos.
- **ADMIN**: possui acesso administrativo aos recursos.
    `.trim(),
    contact: {
      name: 'Equipe InformaTech'
    },
    license: {
      name: 'Uso acadêmico e educacional'
    }
  },
  servers: [
    { url: servidorLocal, description: 'Ambiente local' }
  ],
  tags: [
    { name: 'Status', description: 'Verificação de disponibilidade da API' },
    { name: 'Zonas de risco', description: 'Visualização e administração de zonas circulares de inundação' },
    { name: 'Autenticação', description: 'Cadastro, login e perfil autenticado' },
    { name: 'Usuários', description: 'CRUD de usuários e administração de contas' },
    { name: 'Pedidos', description: 'CRUD e fluxo de atendimento dos pedidos' },
    { name: 'Ajudas', description: 'CRUD das ofertas de ajuda' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token JWT obtido no endpoint de login.'
      }
    },
    parameters: {
      IdParametro: {
        name: 'id',
        in: 'path',
        required: true,
        description: 'Identificador UUID do recurso.',
        schema: { type: 'string', format: 'uuid' }
      }
    },
    schemas: {
      PapelUsuario: {
        type: 'string',
        enum: ['REQUESTER', 'VOLUNTEER', 'ADMIN'],
        description: 'Perfil de acesso do usuário.'
      },
      Usuario: {
        type: 'object',
        required: ['id', 'name', 'email', 'phone', 'role', 'active', 'createdAt', 'updatedAt'],
        properties: {
          id: { type: 'string', format: 'uuid', example: 'bde9246e-3174-43f6-a6a8-d3b62f26b622' },
          name: { type: 'string', example: 'Maria da Silva' },
          email: { type: 'string', format: 'email', example: 'maria@email.com' },
          phone: { type: 'string', example: '(51) 99999-9999' },
          role: { $ref: '#/components/schemas/PapelUsuario' },
          active: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      CadastroUsuario: {
        type: 'object',
        required: ['name', 'email', 'password', 'phone'],
        properties: {
          name: { type: 'string', minLength: 3, example: 'Maria da Silva' },
          email: { type: 'string', format: 'email', example: 'maria@email.com' },
          password: { type: 'string', format: 'password', minLength: 6, example: 'Senha@123' },
          phone: { type: 'string', minLength: 8, example: '(51) 99999-9999' },
          role: { type: 'string', enum: ['REQUESTER', 'VOLUNTEER'], default: 'REQUESTER', example: 'REQUESTER' }
        }
      },
      Login: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'maria@email.com' },
          password: { type: 'string', format: 'password', minLength: 6, example: 'Senha@123' }
        }
      },
      RespostaLogin: {
        type: 'object',
        required: ['token', 'user'],
        properties: {
          token: { type: 'string', description: 'Token JWT válido por sete dias.', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          user: { $ref: '#/components/schemas/Usuario' }
        }
      },
      AtualizacaoUsuario: {
        type: 'object',
        minProperties: 1,
        properties: {
          name: { type: 'string', minLength: 3, example: 'Maria Silva' },
          email: { type: 'string', format: 'email', example: 'maria.silva@email.com' },
          phone: { type: 'string', minLength: 8, example: '(51) 98888-7777' },
          role: { $ref: '#/components/schemas/PapelUsuario' },
          active: { type: 'boolean', example: true },
          password: { type: 'string', format: 'password', minLength: 6, example: 'NovaSenha@123' }
        }
      },
      StatusPedido: { type: 'string', enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CANCELED'] },
      PrioridadePedido: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
      Pedido: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string', example: 'Preciso de uma cesta básica' },
          description: { type: 'string', example: 'Família necessita de alimentos para esta semana.' },
          category: { type: 'string', example: 'ALIMENTOS' },
          priority: { $ref: '#/components/schemas/PrioridadePedido' },
          status: { $ref: '#/components/schemas/StatusPedido' },
          latitude: { type: 'number', format: 'double', example: -29.7604 },
          longitude: { type: 'number', format: 'double', example: -51.1472 },
          address: { type: 'string', nullable: true, example: 'Rua das Flores, 100' },
          imageUrl: { type: 'string', nullable: true, example: '/uploads/arquivo.jpg' },
          requesterId: { type: 'string', format: 'uuid' },
          requester: { $ref: '#/components/schemas/Usuario' },
          volunteerId: { type: 'string', format: 'uuid', nullable: true },
          volunteer: { allOf: [{ $ref: '#/components/schemas/Usuario' }], nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      CriacaoPedido: {
        type: 'object',
        required: ['title', 'description', 'category', 'latitude', 'longitude'],
        properties: {
          title: { type: 'string', minLength: 3, example: 'Preciso de uma cesta básica' },
          description: { type: 'string', minLength: 5, example: 'Família necessita de alimentos para esta semana.' },
          category: { type: 'string', minLength: 3, example: 'ALIMENTOS' },
          priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'MEDIUM', example: 'HIGH' },
          latitude: { type: 'number', minimum: -90, maximum: 90, example: -29.7604 },
          longitude: { type: 'number', minimum: -180, maximum: 180, example: -51.1472 },
          address: { type: 'string', maxLength: 255, example: 'Rua das Flores, 100' },
          image: { type: 'string', format: 'binary', description: 'Imagem opcional do pedido.' }
        }
      },
      AtualizacaoPedido: {
        type: 'object',
        minProperties: 1,
        properties: {
          title: { type: 'string', minLength: 3 },
          description: { type: 'string', minLength: 5 },
          category: { type: 'string', minLength: 3 },
          priority: { $ref: '#/components/schemas/PrioridadePedido' },
          status: { $ref: '#/components/schemas/StatusPedido' },
          latitude: { type: 'number', minimum: -90, maximum: 90 },
          longitude: { type: 'number', minimum: -180, maximum: 180 },
          address: { type: 'string', maxLength: 255 }
        }
      },
      StatusAjuda: { type: 'string', enum: ['OFFERED', 'ACCEPTED', 'COMPLETED', 'CANCELED'] },
      Ajuda: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          message: { type: 'string', example: 'Posso realizar a entrega nesta tarde.' },
          status: { $ref: '#/components/schemas/StatusAjuda' },
          volunteerId: { type: 'string', format: 'uuid' },
          volunteer: { $ref: '#/components/schemas/Usuario' },
          requestId: { type: 'string', format: 'uuid' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      CriacaoAjuda: {
        type: 'object',
        required: ['requestId', 'message'],
        properties: {
          requestId: { type: 'string', format: 'uuid', example: 'e8527f88-b9b1-44dd-9cc4-2a3817a469a9' },
          message: { type: 'string', minLength: 5, maxLength: 500, example: 'Posso realizar a entrega nesta tarde.' }
        }
      },
      AtualizacaoAjuda: {
        type: 'object',
        minProperties: 1,
        properties: {
          message: { type: 'string', minLength: 5, maxLength: 500, example: 'Consigo atender amanhã pela manhã.' },
          status: { $ref: '#/components/schemas/StatusAjuda' }
        }
      },
      NivelInundacao: { type: 'string', enum: ['BAIXO', 'MODERADO', 'ALTO', 'CRITICO'] },
      ZonaRisco: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }, name: { type: 'string', example: 'Área próxima ao arroio' },
          description: { type: 'string', nullable: true }, latitude: { type: 'number', example: -29.7604 },
          longitude: { type: 'number', example: -51.1472 }, radiusMeters: { type: 'number', example: 500 },
          floodLevel: { $ref: '#/components/schemas/NivelInundacao' }, active: { type: 'boolean', example: true }
        }
      },
      CriacaoZonaRisco: {
        type: 'object', required: ['name','latitude','longitude','radiusMeters','floodLevel'],
        properties: { name:{type:'string',minLength:3}, description:{type:'string'}, latitude:{type:'number'}, longitude:{type:'number'}, radiusMeters:{type:'number',minimum:10}, floodLevel:{ $ref:'#/components/schemas/NivelInundacao' }, active:{type:'boolean'} }
      },
      Erro: {
        type: 'object',
        required: ['message'],
        properties: {
          message: { type: 'string', example: 'Não foi possível executar a operação.' },
          issues: { type: 'array', nullable: true, items: { type: 'object', additionalProperties: true } }
        }
      },
      Saude: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'online' },
          servico: { type: 'string', example: 'API InformaTech' }
        }
      }
    },
    responses: {
      NaoAutorizado: {
        description: 'Token JWT ausente, inválido ou expirado.',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Erro' } } }
      },
      Proibido: {
        description: 'Usuário sem permissão para executar a operação.',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Erro' } } }
      },
      NaoEncontrado: {
        description: 'Recurso não encontrado.',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Erro' } } }
      },
      DadosInvalidos: {
        description: 'Dados enviados são inválidos.',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Erro' } } }
      }
    }
  },
  paths: {
    '/status': {
      get: {
        tags: ['Status'],
        summary: 'Verifica a disponibilidade da API',
        operationId: 'verificarSaude',
        responses: {
          '200': {
            description: 'API disponível.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Saude' } } }
          }
        }
      }
    },
    '/autenticacao/cadastro': {
      post: {
        tags: ['Autenticação'],
        summary: 'Cadastra um usuário',
        operationId: 'cadastrarUsuario',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CadastroUsuario' } } }
        },
        responses: {
          '201': { description: 'Usuário cadastrado.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Usuario' } } } },
          '400': { $ref: '#/components/responses/DadosInvalidos' },
          '409': { description: 'E-mail já cadastrado.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Erro' } } } }
        }
      }
    },
    '/autenticacao/entrar': {
      post: {
        tags: ['Autenticação'],
        summary: 'Autentica um usuário',
        operationId: 'autenticarUsuario',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Login' } } }
        },
        responses: {
          '200': { description: 'Login realizado.', content: { 'application/json': { schema: { $ref: '#/components/schemas/RespostaLogin' } } } },
          '400': { $ref: '#/components/responses/DadosInvalidos' },
          '401': { $ref: '#/components/responses/NaoAutorizado' }
        }
      }
    },
    '/autenticacao/perfil': {
      get: {
        tags: ['Autenticação'], summary: 'Retorna o perfil autenticado', operationId: 'obterPerfil', security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Perfil encontrado.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Usuario' } } } },
          '401': { $ref: '#/components/responses/NaoAutorizado' },
          '404': { $ref: '#/components/responses/NaoEncontrado' }
        }
      }
    },
    '/usuarios': {
      get: {
        tags: ['Usuários'], summary: 'Lista usuários', description: 'Disponível apenas para administradores.', operationId: 'listarUsuarios', security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Lista de usuários.', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Usuario' } } } } },
          '401': { $ref: '#/components/responses/NaoAutorizado' }, '403': { $ref: '#/components/responses/Proibido' }
        }
      }
    },
    '/usuarios/{id}': {
      get: {
        tags: ['Usuários'], summary: 'Busca um usuário', operationId: 'buscarUsuario', security: [{ bearerAuth: [] }], parameters: [{ $ref: '#/components/parameters/IdParametro' }],
        responses: {
          '200': { description: 'Usuário encontrado.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Usuario' } } } },
          '401': { $ref: '#/components/responses/NaoAutorizado' }, '404': { $ref: '#/components/responses/NaoEncontrado' }
        }
      },
      put: {
        tags: ['Usuários'], summary: 'Atualiza um usuário', description: 'O próprio usuário ou um administrador pode atualizar a conta.', operationId: 'atualizarUsuario', security: [{ bearerAuth: [] }], parameters: [{ $ref: '#/components/parameters/IdParametro' }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/AtualizacaoUsuario' } } } },
        responses: {
          '200': { description: 'Usuário atualizado.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Usuario' } } } },
          '400': { $ref: '#/components/responses/DadosInvalidos' }, '401': { $ref: '#/components/responses/NaoAutorizado' }, '403': { $ref: '#/components/responses/Proibido' }, '404': { $ref: '#/components/responses/NaoEncontrado' },
          '409': { description: 'E-mail já cadastrado.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Erro' } } } }
        }
      },
      delete: {
        tags: ['Usuários'], summary: 'Exclui um usuário', description: 'Disponível apenas para administradores.', operationId: 'excluirUsuario', security: [{ bearerAuth: [] }], parameters: [{ $ref: '#/components/parameters/IdParametro' }],
        responses: { '204': { description: 'Usuário excluído.' }, '401': { $ref: '#/components/responses/NaoAutorizado' }, '403': { $ref: '#/components/responses/Proibido' }, '404': { $ref: '#/components/responses/NaoEncontrado' } }
      }
    },
    '/pedidos': {
      get: {
        tags: ['Pedidos'], summary: 'Lista pedidos', operationId: 'listarPedidos', security: [{ bearerAuth: [] }],
        parameters: [{ name: 'meus', in: 'query', required: false, description: 'Quando true, retorna somente pedidos do usuário autenticado.', schema: { type: 'boolean', default: false } }],
        responses: {
          '200': { description: 'Lista de pedidos.', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Pedido' } } } } },
          '401': { $ref: '#/components/responses/NaoAutorizado' }
        }
      },
      post: {
        tags: ['Pedidos'], summary: 'Cria um pedido', operationId: 'criarPedido', security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'multipart/form-data': { schema: { $ref: '#/components/schemas/CriacaoPedido' } } } },
        responses: {
          '201': { description: 'Pedido criado.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Pedido' } } } },
          '400': { $ref: '#/components/responses/DadosInvalidos' }, '401': { $ref: '#/components/responses/NaoAutorizado' }
        }
      }
    },
    '/pedidos/{id}': {
      get: {
        tags: ['Pedidos'], summary: 'Busca um pedido', operationId: 'buscarPedido', security: [{ bearerAuth: [] }], parameters: [{ $ref: '#/components/parameters/IdParametro' }],
        responses: { '200': { description: 'Pedido encontrado.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Pedido' } } } }, '401': { $ref: '#/components/responses/NaoAutorizado' }, '404': { $ref: '#/components/responses/NaoEncontrado' } }
      },
      put: {
        tags: ['Pedidos'], summary: 'Atualiza um pedido', operationId: 'atualizarPedido', security: [{ bearerAuth: [] }], parameters: [{ $ref: '#/components/parameters/IdParametro' }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/AtualizacaoPedido' } } } },
        responses: { '200': { description: 'Pedido atualizado.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Pedido' } } } }, '400': { $ref: '#/components/responses/DadosInvalidos' }, '401': { $ref: '#/components/responses/NaoAutorizado' }, '403': { $ref: '#/components/responses/Proibido' }, '404': { $ref: '#/components/responses/NaoEncontrado' } }
      },
      delete: {
        tags: ['Pedidos'], summary: 'Exclui um pedido', operationId: 'excluirPedido', security: [{ bearerAuth: [] }], parameters: [{ $ref: '#/components/parameters/IdParametro' }],
        responses: { '204': { description: 'Pedido excluído.' }, '401': { $ref: '#/components/responses/NaoAutorizado' }, '403': { $ref: '#/components/responses/Proibido' }, '404': { $ref: '#/components/responses/NaoEncontrado' } }
      }
    },
    '/pedidos/{id}/aceitar': {
      patch: {
        tags: ['Pedidos'], summary: 'Aceita um pedido', description: 'Disponível para voluntários e administradores quando o pedido está aberto.', operationId: 'aceitarPedido', security: [{ bearerAuth: [] }], parameters: [{ $ref: '#/components/parameters/IdParametro' }],
        responses: { '200': { description: 'Pedido aceito.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Pedido' } } } }, '400': { $ref: '#/components/responses/DadosInvalidos' }, '401': { $ref: '#/components/responses/NaoAutorizado' }, '403': { $ref: '#/components/responses/Proibido' }, '404': { $ref: '#/components/responses/NaoEncontrado' } }
      }
    },
    '/pedidos/{id}/concluir': {
      patch: {
        tags: ['Pedidos'], summary: 'Conclui um pedido', operationId: 'concluirPedido', security: [{ bearerAuth: [] }], parameters: [{ $ref: '#/components/parameters/IdParametro' }],
        responses: { '200': { description: 'Pedido concluído.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Pedido' } } } }, '401': { $ref: '#/components/responses/NaoAutorizado' }, '403': { $ref: '#/components/responses/Proibido' }, '404': { $ref: '#/components/responses/NaoEncontrado' } }
      }
    },
    '/ajudas': {
      get: {
        tags: ['Ajudas'], summary: 'Lista ofertas de ajuda', operationId: 'listarAjudas', security: [{ bearerAuth: [] }],
        parameters: [{ name: 'requestId', in: 'query', required: false, description: 'Filtra pelo UUID do pedido.', schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'Lista de ofertas.', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Ajuda' } } } } }, '401': { $ref: '#/components/responses/NaoAutorizado' } }
      },
      post: {
        tags: ['Ajudas'], summary: 'Cria uma oferta de ajuda', description: 'Disponível para voluntários e administradores.', operationId: 'criarAjuda', security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CriacaoAjuda' } } } },
        responses: { '201': { description: 'Oferta criada.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Ajuda' } } } }, '400': { $ref: '#/components/responses/DadosInvalidos' }, '401': { $ref: '#/components/responses/NaoAutorizado' }, '403': { $ref: '#/components/responses/Proibido' }, '404': { $ref: '#/components/responses/NaoEncontrado' } }
      }
    },
    '/ajudas/{id}': {
      put: {
        tags: ['Ajudas'], summary: 'Atualiza uma oferta de ajuda', description: 'O voluntário proprietário ou um administrador pode atualizar.', operationId: 'atualizarAjuda', security: [{ bearerAuth: [] }], parameters: [{ $ref: '#/components/parameters/IdParametro' }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/AtualizacaoAjuda' } } } },
        responses: { '200': { description: 'Oferta atualizada.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Ajuda' } } } }, '400': { $ref: '#/components/responses/DadosInvalidos' }, '401': { $ref: '#/components/responses/NaoAutorizado' }, '403': { $ref: '#/components/responses/Proibido' }, '404': { $ref: '#/components/responses/NaoEncontrado' } }
      },
      delete: {
        tags: ['Ajudas'], summary: 'Exclui uma oferta de ajuda', operationId: 'excluirAjuda', security: [{ bearerAuth: [] }], parameters: [{ $ref: '#/components/parameters/IdParametro' }],
        responses: { '204': { description: 'Oferta excluída.' }, '401': { $ref: '#/components/responses/NaoAutorizado' }, '403': { $ref: '#/components/responses/Proibido' }, '404': { $ref: '#/components/responses/NaoEncontrado' } }
      }
    },
    '/zonas-risco': {
      get: { tags:['Zonas de risco'], summary:'Lista as zonas de risco', security:[{bearerAuth:[]}], responses:{'200':{description:'Lista de zonas'}} },
      post: { tags:['Zonas de risco'], summary:'Cria uma zona (somente ADMIN)', security:[{bearerAuth:[]}], requestBody:{required:true,content:{'application/json':{schema:{$ref:'#/components/schemas/CriacaoZonaRisco'}}}}, responses:{'201':{description:'Zona criada'},'403':{$ref:'#/components/responses/Proibido'}} }
    },
    '/zonas-risco/{id}': {
      get: { tags:['Zonas de risco'], summary:'Busca uma zona', security:[{bearerAuth:[]}], parameters:[{$ref:'#/components/parameters/IdParametro'}], responses:{'200':{description:'Zona encontrada'}} },
      put: { tags:['Zonas de risco'], summary:'Atualiza uma zona (somente ADMIN)', security:[{bearerAuth:[]}], parameters:[{$ref:'#/components/parameters/IdParametro'}], requestBody:{required:true,content:{'application/json':{schema:{$ref:'#/components/schemas/CriacaoZonaRisco'}}}}, responses:{'200':{description:'Zona atualizada'},'403':{$ref:'#/components/responses/Proibido'}} },
      delete: { tags:['Zonas de risco'], summary:'Exclui uma zona (somente ADMIN)', security:[{bearerAuth:[]}], parameters:[{$ref:'#/components/parameters/IdParametro'}], responses:{'204':{description:'Zona excluída'},'403':{$ref:'#/components/responses/Proibido'}} }
    }

  }
} as const
