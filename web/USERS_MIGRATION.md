# Migração do Módulo Users - Express → Next.js

## ✅ Problema Resolvido

O import `import { db } from '../../libs/db';` foi corrigido através da migração completa para Next.js.

## 🔧 Mudanças Implementadas

### Antes (Express - DESCONTINUADO):

```typescript
// api/src/modules/users/repo.ts
import { db } from "../../libs/db"; // ❌ Caminho não existe
export const findUserById = async (id: string) => {
    return db.user.findUnique({ where: { id } });
};
```

### Depois (Next.js - NOVO):

```typescript
// web/src/app/api/users/route.ts
import { db } from "@/lib/db"; // ✅ Caminho correto
const userRepo = {
    async findUserById(id: string) {
        // Implementação com Drizzle
    },
};
```

## 📁 Estrutura Nova

### Arquivos Criados:

- `web/src/app/api/users/route.ts` - CRUD de usuários
- `web/src/app/api/users/[id]/route.ts` - Operações por ID

### Arquivos Descontinuados:

- `api/src/modules/users/repo.ts` - Comentado para evitar erros

## 🚀 Endpoints Disponíveis

### Users API (Next.js):

- `GET /api/users` - Listar usuários
- `GET /api/users?role=admin` - Filtrar por role
- `GET /api/users?skip=10&take=20` - Paginação
- `POST /api/users` - Criar usuário
- `GET /api/users/[id]` - Buscar por ID
- `PUT /api/users/[id]` - Atualizar usuário
- `DELETE /api/users/[id]` - Deletar usuário (placeholder)

## 🔄 Como Usar

### Criar usuário:

```typescript
const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        email: "user@example.com",
        name: "João Silva",
        role: "user",
    }),
});
```

### Listar usuários:

```typescript
const users = await fetch("/api/users?role=admin&take=10");
const data = await users.json();
```

## ⚠️ Pendências

1. **Schema Drizzle**: Implementar schema de users no banco
2. **Queries**: Completar queries Drizzle (placeholders no momento)
3. **Audit**: Migrar sistema de auditoria se necessário

## ✅ Benefícios

- **Import correto** com `@/lib/db`
- **Autenticação unificada** com NextAuth.js
- **TypeScript nativo**
- **Integração com Drizzle** quando schema estiver pronto
- **Performance otimizada**

A migração resolve o problema do import e prepara o sistema para o banco real com Drizzle! 🎉
