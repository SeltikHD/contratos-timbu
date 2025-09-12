# 🔐 Sistema de Autenticação - Contratos Timbu

## 📋 Implementação Completa

### ✅ O que foi implementado

1. **Esquema do Banco de Dados**
   - Tabelas NextAuth.js v5 completas (users, accounts, sessions, verification_tokens)
   - Tabelas personalizadas (profiles, user_projects, activity_logs)
   - Triggers automáticos para updatedAt e criação de perfil
   - Índices para performance
   - Tipos ENUM para roles e permissões

2. **Configuração NextAuth.js v5**
   - Adaptador Drizzle ORM
   - Provider Google OAuth
   - Callbacks personalizados para session e JWT
   - Middleware de proteção de rotas

3. **Interface de Usuário**
   - Header com avatar e menu de usuário
   - Página de perfil completa com estatísticas
   - Componentes de autenticação (SignIn, SignOut)
   - Formulário de edição de perfil

4. **Componentes e Páginas**
   - `/auth/signin` - Página de login
   - `/profile` - Página de perfil do usuário
   - `components/auth/` - Componentes de autenticação
   - `components/header.tsx` - Header com integração de auth

## 🚀 Como executar

### 1. Configurar Variáveis de Ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Configure as variáveis necessárias:
```

**`.env.local`:**

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/contratos_timbu"
AUTH_SECRET="sua_chave_secreta_aqui"
AUTH_GOOGLE_ID="seu_google_client_id.apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="seu_google_client_secret"
```

### 2. Configurar Google OAuth

1. Acesse o [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto ou selecione um existente
3. Ative a API "Google+ API"
4. Vá em "Credenciais" > "Criar Credenciais" > "ID do cliente OAuth 2.0"
5. Configure os URLs autorizados:
   - **JavaScript origins:** `http://localhost:3000`
   - **Redirect URIs:** `http://localhost:3000/api/auth/callback/google`

### 3. Executar Migrações do Banco

```bash
# Executar o script de criação das tabelas de autenticação
psql -U usuario -d contratos_timbu -f src/db/ddl/auth.sql

# Inserir dados de exemplo (opcional)
psql -U usuario -d contratos_timbu -f src/db/init/auth_inserts.sql
```

### 4. Instalar Dependências e Rodar

```bash
# Instalar dependências (se necessário)
pnpm install

# Executar o projeto
pnpm dev
```

### 5. Gerar AUTH_SECRET

```bash
# Gerar uma chave secreta segura
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🔧 Estrutura dos Arquivos

```text
src/
├── auth.ts                 # Configuração NextAuth.js v5
├── middleware.ts           # Middleware de proteção
├── app/
│   ├── auth/
│   │   └── signin/page.tsx # Página de login
│   └── profile/page.tsx    # Página de perfil
├── components/
│   ├── auth/
│   │   ├── signin-button.tsx
│   │   ├── signout-button.tsx
│   │   └── profile-edit-form.tsx
│   └── header.tsx          # Header com auth
├── db/
│   ├── schema.ts           # Schema Drizzle com auth
│   ├── ddl/
│   │   └── auth.sql        # Script de criação das tabelas
│   └── init/
│       └── auth_inserts.sql # Dados de exemplo
└── types/
    └── index.ts           # Types TypeScript
```

## 🎯 Funcionalidades

### Autenticação

- ✅ Login com Google OAuth
- ✅ Sessões persistentes
- ✅ Middleware de proteção
- ✅ Logout seguro

### Perfis de Usuário

- ✅ Perfil automático na criação
- ✅ Bio, empresa, localização
- ✅ Links sociais (LinkedIn, GitHub)
- ✅ Configurações (tema, idioma, notificações)
- ✅ Estatísticas de projetos

### Controle de Acesso

- ✅ Roles por usuário (ADMIN, USER)
- ✅ Permissões por projeto (OWNER, MANAGER, EDITOR, VIEWER)
- ✅ Array de permissões específicas
- ✅ Associação usuário-projeto

### Logs e Auditoria

- ✅ Log de todas as atividades
- ✅ Metadados JSON flexíveis
- ✅ IP e User-Agent tracking
- ✅ Histórico completo

## 🔐 Segurança

- **CSRF Protection** integrada no NextAuth.js
- **Cookies seguros** com httpOnly e secure flags
- **Validação de sessão** em todas as rotas protegidas
- **Sanitização** de dados de entrada
- **Rate limiting** pode ser adicionado no middleware

## 📊 Dados de Exemplo

O script `auth_inserts.sql` inclui:

- 5 usuários com perfis completos
- Associações com projetos existentes
- Logs de atividade realísticos
- Sessões ativas de demonstração

## 🐛 Troubleshooting

### Erro de conexão com DB

```bash
# Verificar se o PostgreSQL está rodando
sudo systemctl status postgresql

# Verificar se o banco existe
psql -U usuario -l | grep contratos_timbu
```

### Erro de Google OAuth

- Verificar se as URLs estão corretas no Google Console
- Confirmar se CLIENT_ID e SECRET estão corretos
- Verificar se a API está ativada

### Erro de AUTH_SECRET

```bash
# Gerar nova secret
openssl rand -base64 32
```

## 📞 Próximos Passos

1. Testar o fluxo de autenticação
2. Personalizar a página de perfil
3. Implementar controle de acesso nas páginas de projeto
4. Configurar notificações por email
5. Deploy em produção

---

**Sistema desenvolvido com Next.js 15, NextAuth.js v5, Drizzle ORM e PostgreSQL** 🚀
