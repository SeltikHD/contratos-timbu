-- MIGRAÇÃO COMPLETA DE AUTENTICAÇÃO
-- Execute este script para criar todas as tabelas de autenticação
-- Baseado no NextAuth.js v5 (Auth.js) com adaptador Drizzle
BEGIN;
-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Tipos ENUM para roles e temas
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'user_role'
) THEN CREATE TYPE user_role AS ENUM ('ADMIN', 'USER');
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'theme'
) THEN CREATE TYPE theme AS ENUM ('light', 'dark', 'system');
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'project_role'
) THEN CREATE TYPE project_role AS ENUM ('OWNER', 'MANAGER', 'EDITOR', 'VIEWER');
END IF;
END $$;
-- Tabela de usuários (NextAuth core)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    "emailVerified" TIMESTAMP WITH TIME ZONE,
    image TEXT,
    role user_role DEFAULT 'USER',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
-- Tabela de contas OAuth (NextAuth core)
CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" TEXT NOT NULL,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT accounts_userId_fkey FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT accounts_provider_providerAccountId_key UNIQUE (provider, "providerAccountId")
);
-- Tabela de sessões (NextAuth core)
CREATE TABLE IF NOT EXISTS sessions (
    "sessionToken" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    expires TIMESTAMP WITH TIME ZONE NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT sessions_userId_fkey FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);
-- Tabela de tokens de verificação (NextAuth core)
CREATE TABLE IF NOT EXISTS verification_tokens (
    identifier TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT verification_tokens_identifier_token_key UNIQUE (identifier, token)
);
-- Tabela de perfis dos usuários (personalizado)
CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" TEXT UNIQUE NOT NULL,
    bio TEXT,
    company TEXT,
    location TEXT,
    website TEXT,
    phone TEXT,
    "birthDate" DATE,
    linkedin TEXT,
    github TEXT,
    theme theme DEFAULT 'system',
    language TEXT DEFAULT 'pt-BR',
    timezone TEXT DEFAULT 'America/Sao_Paulo',
    "emailNotifications" BOOLEAN DEFAULT TRUE,
    "pushNotifications" BOOLEAN DEFAULT TRUE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT profiles_userId_fkey FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);
-- Tabela de associação usuário-projeto (personalizado)
CREATE TABLE IF NOT EXISTS user_projects (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" TEXT NOT NULL,
    "codProjeto" INTEGER NOT NULL,
    role project_role DEFAULT 'VIEWER',
    permissions TEXT [] DEFAULT ARRAY ['read'],
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT user_projects_userId_fkey FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT user_projects_codProjeto_fkey FOREIGN KEY ("codProjeto") REFERENCES projetos("codprojeto") ON DELETE CASCADE,
    CONSTRAINT user_projects_userId_codProjeto_key UNIQUE ("userId", "codProjeto")
);
-- Tabela de logs de atividade (personalizado)
CREATE TABLE IF NOT EXISTS activity_logs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" TEXT NOT NULL,
    action TEXT NOT NULL,
    resource TEXT NOT NULL,
    "resourceId" TEXT,
    description TEXT,
    metadata JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT activity_logs_userId_fkey FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);
-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_accounts_userId ON accounts("userId");
CREATE INDEX IF NOT EXISTS idx_sessions_userId ON sessions("userId");
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires);
CREATE INDEX IF NOT EXISTS idx_profiles_userId ON profiles("userId");
CREATE INDEX IF NOT EXISTS idx_user_projects_userId ON user_projects("userId");
CREATE INDEX IF NOT EXISTS idx_user_projects_codProjeto ON user_projects("codProjeto");
CREATE INDEX IF NOT EXISTS idx_activity_logs_userId ON activity_logs("userId");
CREATE INDEX IF NOT EXISTS idx_activity_logs_createdAt ON activity_logs("createdAt");
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_resource ON activity_logs(resource);
-- Triggers para atualizar updatedAt automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW."updatedAt" = NOW();
RETURN NEW;
END;
$$ language 'plpgsql';
-- Aplicar triggers nas tabelas com updatedAt
DO $$ BEGIN DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE
UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_accounts_updated_at ON accounts;
CREATE TRIGGER update_accounts_updated_at BEFORE
UPDATE ON accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_sessions_updated_at ON sessions;
CREATE TRIGGER update_sessions_updated_at BEFORE
UPDATE ON sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE
UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_user_projects_updated_at ON user_projects;
CREATE TRIGGER update_user_projects_updated_at BEFORE
UPDATE ON user_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
END $$;
-- Função para criar perfil automaticamente quando usuário é criado
CREATE OR REPLACE FUNCTION create_user_profile() RETURNS TRIGGER AS $$ BEGIN
INSERT INTO profiles ("userId")
VALUES (NEW.id);
RETURN NEW;
END;
$$ language 'plpgsql';
-- Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS create_profile_on_user_creation ON users;
CREATE TRIGGER create_profile_on_user_creation
AFTER
INSERT ON users FOR EACH ROW EXECUTE FUNCTION create_user_profile();
-- Inserir usuário administrador padrão (se não existir)
INSERT INTO users (id, name, email, "emailVerified", image, role)
VALUES (
        'admin_default',
        'Administrador',
        'admin@contratostimbu.com',
        NOW(),
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
        'ADMIN'
    ) ON CONFLICT (email) DO NOTHING;
COMMIT;
-- Verificação final
SELECT schemaname,
    tablename,
    tableowner
FROM pg_tables
WHERE schemaname = 'public'
    AND tablename IN (
        'users',
        'accounts',
        'sessions',
        'verification_tokens',
        'profiles',
        'user_projects',
        'activity_logs'
    )
ORDER BY tablename;