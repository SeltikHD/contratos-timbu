#!/bin/bash

# Script para atualizar o projeto para NextAuth.js v5 e corrigir erros

echo "🔧 Atualizando projeto para NextAuth.js v5..."

# 1. Instalar dependências corretas
echo "📦 Instalando NextAuth.js v5..."
pnpm install next-auth@5.0.0-beta.25

# 2. Limpar cache e builds anteriores
echo "🧹 Limpando cache..."
rm -rf .next
rm -rf node_modules/.cache

# 3. Gerar nova migração do Drizzle
echo "🗄️ Gerando migração do banco..."
pnpm drizzle-kit generate

# 4. Verificar tipos
echo "🔍 Verificando tipos TypeScript..."
pnpm type-check

echo "✅ Atualização concluída!"
echo ""
echo "📝 Próximos passos:"
echo "1. Configure as variáveis de ambiente no .env.local:"
echo "   - AUTH_SECRET (gerar com: openssl rand -base64 32)"
echo "   - AUTH_GOOGLE_ID (do Google Console)"
echo "   - AUTH_GOOGLE_SECRET (do Google Console)"
echo "   - DATABASE_URL (sua string de conexão PostgreSQL)"
echo ""
echo "2. Execute o script SQL de autenticação:"
echo "   psql -U usuario -d contratos_timbu -f src/db/ddl/auth.sql"
echo ""
echo "3. (Opcional) Execute os dados de exemplo:"
echo "   psql -U usuario -d contratos_timbu -f src/db/init/auth_inserts.sql"
echo ""
echo "4. Inicie o servidor de desenvolvimento:"
echo "   pnpm dev"