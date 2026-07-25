# Como executar o InformaTech

## 1. Pré-requisitos

- Node.js 20 LTS
- MySQL 8 em execução
- Expo Go no celular ou emulador Android

## 2. Configurar o backend

Abra `backend/.env` e ajuste:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=SUA_SENHA_DO_MYSQL
DB_NAME=informatech_PI
```

O backend cria o banco e as tabelas automaticamente. Depois:

```bash
cd backend
npm install
npm run dev
```

Teste no navegador:

- `http://localhost:3333/status`
- `http://localhost:3333/documentacao`

Para criar o administrador:

```bash
npm run create-admin
```

## 3. Configurar o aplicativo

No Windows, execute `ipconfig` e copie o IPv4 do Wi-Fi. Em `mobile/.env`:

```env
EXPO_PUBLIC_API_URL=http://SEU_IPV4:3333
```

Exemplo:

```env
EXPO_PUBLIC_API_URL=http://172.20.86.111:3333
```

Depois:

```bash
cd mobile
npm install
npx expo start --clear
```

O computador e o celular devem estar na mesma rede. No Firewall do Windows, permita o Node.js em redes privadas.

## 4. Teste pelo celular

Antes de abrir o app, acesse no navegador do celular:

`http://SEU_IPV4:3333/status`

Se não abrir, o problema é rede/firewall/IP, não o aplicativo.

## Atualização das zonas de risco
Esta versão usa `synchronize: true` no backend para incluir automaticamente os campos `riverLevelMeters`, `active` e `createdBy` na tabela `risk_zones`. Reinicie o backend uma vez após atualizar o projeto.
