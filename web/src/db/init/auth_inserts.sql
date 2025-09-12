-- INSERTS PARA DADOS DE AUTENTICAÇÃO E USUÁRIOS
-- Execute após criar as tabelas de autenticação
-- Usando ON CONFLICT para evitar erros em re-execuções
-- Inserir usuários de exemplo
INSERT INTO users (
        id,
        name,
        email,
        "emailVerified",
        image,
        role,
        "createdAt",
        "updatedAt"
    )
VALUES (
        'user_1_admin',
        'João Silva',
        'joao.silva@contratostimbu.com',
        NOW(),
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
        'ADMIN',
        NOW(),
        NOW()
    ),
    (
        'user_2_manager',
        'Maria Santos',
        'maria.santos@contratostimbu.com',
        NOW(),
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
        'USER',
        NOW(),
        NOW()
    ),
    (
        'user_3_dev',
        'Pedro Costa',
        'pedro.costa@contratostimbu.com',
        NOW(),
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        'USER',
        NOW(),
        NOW()
    ),
    (
        'user_4_finance',
        'Ana Oliveira',
        'ana.oliveira@contratostimbu.com',
        NOW(),
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
        'USER',
        NOW(),
        NOW()
    ),
    (
        'user_5_support',
        'Carlos Ferreira',
        'carlos.ferreira@contratostimbu.com',
        NOW(),
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
        'USER',
        NOW(),
        NOW()
    ) ON CONFLICT (email) DO NOTHING;
-- Inserir perfis dos usuários
INSERT INTO profiles (
        id,
        "userId",
        bio,
        company,
        location,
        website,
        phone,
        "birthDate",
        linkedin,
        github,
        theme,
        language,
        timezone,
        "emailNotifications",
        "pushNotifications",
        "createdAt",
        "updatedAt"
    )
VALUES (
        'profile_1',
        'user_1_admin',
        'Administrador do sistema com mais de 10 anos de experiência em gestão de contratos e projetos públicos.',
        'Prefeitura Municipal',
        'São Paulo, SP',
        'https://contratostimbu.com',
        '(11) 99999-0001',
        '1980-03-15',
        'https://linkedin.com/in/joaosilva',
        'https://github.com/joaosilva',
        'system',
        'pt-BR',
        'America/Sao_Paulo',
        TRUE,
        TRUE,
        NOW(),
        NOW()
    ),
    (
        'profile_2',
        'user_2_manager',
        'Gerente de projetos especializada em infraestrutura urbana e contratos de grande porte.',
        'Secretaria de Obras',
        'Rio de Janeiro, RJ',
        'https://mariasantos.dev',
        '(21) 98888-0002',
        '1985-07-22',
        'https://linkedin.com/in/mariasantos',
        NULL,
        'light',
        'pt-BR',
        'America/Sao_Paulo',
        TRUE,
        FALSE,
        NOW(),
        NOW()
    ),
    (
        'profile_3',
        'user_3_dev',
        'Desenvolvedor full-stack focado em soluções para o setor público.',
        'TechGov Solutions',
        'Belo Horizonte, MG',
        'https://pedrocosta.tech',
        '(31) 97777-0003',
        '1990-11-08',
        'https://linkedin.com/in/pedrocosta',
        'https://github.com/pedrocosta',
        'dark',
        'pt-BR',
        'America/Sao_Paulo',
        TRUE,
        TRUE,
        NOW(),
        NOW()
    ),
    (
        'profile_4',
        'user_4_finance',
        'Analista financeira com expertise em contratos públicos e gestão orçamentária.',
        'Secretaria da Fazenda',
        'Brasília, DF',
        NULL,
        '(61) 96666-0004',
        '1988-05-12',
        'https://linkedin.com/in/anaoliveira',
        NULL,
        'system',
        'pt-BR',
        'America/Sao_Paulo',
        TRUE,
        TRUE,
        NOW(),
        NOW()
    ),
    (
        'profile_5',
        'user_5_support',
        'Especialista em suporte técnico e treinamento de usuários em sistemas governamentais.',
        'Support Tech',
        'Porto Alegre, RS',
        'https://carlosferreira.com.br',
        '(51) 95555-0005',
        '1982-09-30',
        'https://linkedin.com/in/carlosferreira',
        'https://github.com/carlosferreira',
        'light',
        'pt-BR',
        'America/Sao_Paulo',
        FALSE,
        TRUE,
        NOW(),
        NOW()
    ) ON CONFLICT ("userId") DO NOTHING;
-- Associar usuários aos projetos existentes
INSERT INTO user_projects (
        "userId",
        "codProjeto",
        role,
        permissions,
        "createdAt",
        "updatedAt"
    )
VALUES -- João (Admin) - Owner de vários projetos
    (
        'user_1_admin',
        1,
        'OWNER',
        ARRAY ['read', 'write', 'delete', 'manage_users'],
        NOW(),
        NOW()
    ),
    (
        'user_1_admin',
        2,
        'OWNER',
        ARRAY ['read', 'write', 'delete', 'manage_users'],
        NOW(),
        NOW()
    ),
    (
        'user_1_admin',
        3,
        'MANAGER',
        ARRAY ['read', 'write', 'manage_tasks'],
        NOW(),
        NOW()
    ),
    (
        'user_1_admin',
        4,
        'OWNER',
        ARRAY ['read', 'write', 'delete', 'manage_users'],
        NOW(),
        NOW()
    ),
    (
        'user_1_admin',
        5,
        'MANAGER',
        ARRAY ['read', 'write', 'manage_tasks'],
        NOW(),
        NOW()
    ),
    -- Maria (Manager) - Gerente de projetos de infraestrutura
    (
        'user_2_manager',
        1,
        'MANAGER',
        ARRAY ['read', 'write', 'manage_tasks'],
        NOW(),
        NOW()
    ),
    (
        'user_2_manager',
        3,
        'MANAGER',
        ARRAY ['read', 'write', 'manage_tasks'],
        NOW(),
        NOW()
    ),
    (
        'user_2_manager',
        10,
        'OWNER',
        ARRAY ['read', 'write', 'delete', 'manage_users'],
        NOW(),
        NOW()
    ),
    (
        'user_2_manager',
        17,
        'MANAGER',
        ARRAY ['read', 'write', 'manage_tasks'],
        NOW(),
        NOW()
    ),
    (
        'user_2_manager',
        18,
        'MANAGER',
        ARRAY ['read', 'write', 'manage_tasks'],
        NOW(),
        NOW()
    ),
    (
        'user_2_manager',
        19,
        'OWNER',
        ARRAY ['read', 'write', 'delete', 'manage_users'],
        NOW(),
        NOW()
    ),
    -- Pedro (Dev) - Editor de projetos de TI
    (
        'user_3_dev',
        13,
        'EDITOR',
        ARRAY ['read', 'write'],
        NOW(),
        NOW()
    ),
    (
        'user_3_dev',
        15,
        'EDITOR',
        ARRAY ['read', 'write'],
        NOW(),
        NOW()
    ),
    (
        'user_3_dev',
        22,
        'MANAGER',
        ARRAY ['read', 'write', 'manage_tasks'],
        NOW(),
        NOW()
    ),
    (
        'user_3_dev',
        23,
        'EDITOR',
        ARRAY ['read', 'write'],
        NOW(),
        NOW()
    ),
    (
        'user_3_dev',
        25,
        'EDITOR',
        ARRAY ['read', 'write'],
        NOW(),
        NOW()
    ),
    (
        'user_3_dev',
        30,
        'OWNER',
        ARRAY ['read', 'write', 'delete', 'manage_users'],
        NOW(),
        NOW()
    ),
    (
        'user_3_dev',
        34,
        'EDITOR',
        ARRAY ['read', 'write'],
        NOW(),
        NOW()
    ),
    -- Ana (Finance) - Visualizadora com foco em valores
    (
        'user_4_finance',
        2,
        'VIEWER',
        ARRAY ['read'],
        NOW(),
        NOW()
    ),
    (
        'user_4_finance',
        5,
        'VIEWER',
        ARRAY ['read'],
        NOW(),
        NOW()
    ),
    (
        'user_4_finance',
        6,
        'VIEWER',
        ARRAY ['read'],
        NOW(),
        NOW()
    ),
    (
        'user_4_finance',
        8,
        'VIEWER',
        ARRAY ['read'],
        NOW(),
        NOW()
    ),
    (
        'user_4_finance',
        20,
        'VIEWER',
        ARRAY ['read'],
        NOW(),
        NOW()
    ),
    (
        'user_4_finance',
        21,
        'EDITOR',
        ARRAY ['read', 'write'],
        NOW(),
        NOW()
    ),
    (
        'user_4_finance',
        26,
        'VIEWER',
        ARRAY ['read'],
        NOW(),
        NOW()
    ),
    (
        'user_4_finance',
        35,
        'VIEWER',
        ARRAY ['read'],
        NOW(),
        NOW()
    ),
    (
        'user_4_finance',
        40,
        'VIEWER',
        ARRAY ['read'],
        NOW(),
        NOW()
    ),
    (
        'user_4_finance',
        44,
        'VIEWER',
        ARRAY ['read'],
        NOW(),
        NOW()
    ),
    -- Carlos (Support) - Visualizador geral
    (
        'user_5_support',
        7,
        'VIEWER',
        ARRAY ['read'],
        NOW(),
        NOW()
    ),
    (
        'user_5_support',
        16,
        'VIEWER',
        ARRAY ['read'],
        NOW(),
        NOW()
    ),
    (
        'user_5_support',
        31,
        'VIEWER',
        ARRAY ['read'],
        NOW(),
        NOW()
    ),
    (
        'user_5_support',
        33,
        'VIEWER',
        ARRAY ['read'],
        NOW(),
        NOW()
    ),
    (
        'user_5_support',
        39,
        'EDITOR',
        ARRAY ['read', 'write'],
        NOW(),
        NOW()
    ),
    (
        'user_5_support',
        47,
        'VIEWER',
        ARRAY ['read'],
        NOW(),
        NOW()
    ) ON CONFLICT ("userId", "codProjeto") DO NOTHING;
-- Inserir logs de atividades de exemplo
INSERT INTO activity_logs (
        "userId",
        action,
        resource,
        "resourceId",
        description,
        metadata,
        "ipAddress",
        "userAgent",
        "createdAt"
    )
VALUES (
        'user_1_admin',
        'LOGIN',
        'system',
        NULL,
        'Usuário fez login no sistema',
        '{"method": "google", "success": true}',
        '192.168.1.100',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        NOW() - INTERVAL '2 hours'
    ),
    (
        'user_1_admin',
        'CREATE',
        'project',
        '4',
        'Criou novo projeto de transporte',
        '{"project_name": "Projeto 0004 - Transporte", "value": 928252.58}',
        '192.168.1.100',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        NOW() - INTERVAL '1 day'
    ),
    (
        'user_2_manager',
        'LOGIN',
        'system',
        NULL,
        'Usuário fez login no sistema',
        '{"method": "google", "success": true}',
        '192.168.1.101',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        NOW() - INTERVAL '30 minutes'
    ),
    (
        'user_2_manager',
        'UPDATE',
        'project',
        '3',
        'Atualizou status do projeto para concluído',
        '{"old_status": "2", "new_status": "5"}',
        '192.168.1.101',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        NOW() - INTERVAL '2 hours'
    ),
    (
        'user_3_dev',
        'LOGIN',
        'system',
        NULL,
        'Usuário fez login no sistema',
        '{"method": "google", "success": true}',
        '192.168.1.102',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
        NOW() - INTERVAL '1 hour'
    ),
    (
        'user_3_dev',
        'VIEW',
        'project',
        '15',
        'Visualizou detalhes do projeto TI',
        '{"project_name": "Projeto 0015 - TI"}',
        '192.168.1.102',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
        NOW() - INTERVAL '45 minutes'
    ),
    (
        'user_4_finance',
        'LOGIN',
        'system',
        NULL,
        'Usuário fez login no sistema',
        '{"method": "google", "success": true}',
        '192.168.1.103',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        NOW() - INTERVAL '3 hours'
    ),
    (
        'user_4_finance',
        'EXPORT',
        'report',
        'financial_summary',
        'Exportou relatório financeiro',
        '{"format": "xlsx", "period": "2024-Q4"}',
        '192.168.1.103',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        NOW() - INTERVAL '2 hours'
    ),
    (
        'user_5_support',
        'LOGIN',
        'system',
        NULL,
        'Usuário fez login no sistema',
        '{"method": "google", "success": true}',
        '192.168.1.104',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        NOW() - INTERVAL '4 hours'
    ),
    (
        'user_5_support',
        'HELP',
        'system',
        NULL,
        'Acessou sistema de ajuda',
        '{"section": "user_manual", "page": "projects"}',
        '192.168.1.104',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        NOW() - INTERVAL '3 hours'
    );
-- Inserir algumas sessões ativas (para demonstração - normalmente criadas pelo NextAuth)
INSERT INTO sessions (
        "sessionToken",
        "userId",
        expires,
        "createdAt",
        "updatedAt"
    )
VALUES (
        'session_token_admin_123',
        'user_1_admin',
        NOW() + INTERVAL '30 days',
        NOW(),
        NOW()
    ),
    (
        'session_token_manager_456',
        'user_2_manager',
        NOW() + INTERVAL '30 days',
        NOW(),
        NOW()
    ),
    (
        'session_token_dev_789',
        'user_3_dev',
        NOW() + INTERVAL '30 days',
        NOW(),
        NOW()
    );
-- Inserir contas OAuth de exemplo (normalmente criadas pelo NextAuth)
INSERT INTO accounts (
        "userId",
        type,
        provider,
        "providerAccountId",
        access_token,
        expires_at,
        token_type,
        scope,
        id_token,
        "createdAt",
        "updatedAt"
    )
VALUES (
        'user_1_admin',
        'oauth',
        'google',
        'google_123456789',
        'ya29.example_access_token_admin',
        EXTRACT(
            EPOCH
            FROM NOW() + INTERVAL '1 hour'
        )::INTEGER,
        'Bearer',
        'openid email profile',
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.example_id_token_admin',
        NOW(),
        NOW()
    ),
    (
        'user_2_manager',
        'oauth',
        'google',
        'google_987654321',
        'ya29.example_access_token_manager',
        EXTRACT(
            EPOCH
            FROM NOW() + INTERVAL '1 hour'
        )::INTEGER,
        'Bearer',
        'openid email profile',
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.example_id_token_manager',
        NOW(),
        NOW()
    ),
    (
        'user_3_dev',
        'oauth',
        'google',
        'google_456789123',
        'ya29.example_access_token_dev',
        EXTRACT(
            EPOCH
            FROM NOW() + INTERVAL '1 hour'
        )::INTEGER,
        'Bearer',
        'openid email profile',
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.example_id_token_dev',
        NOW(),
        NOW()
    );
-- Inserir tokens de verificação de exemplo
INSERT INTO verification_tokens (identifier, token, expires)
VALUES (
        'ana.oliveira@contratostimbu.com',
        'verification_token_ana_123',
        NOW() + INTERVAL '1 day'
    ),
    (
        'carlos.ferreira@contratostimbu.com',
        'verification_token_carlos_456',
        NOW() + INTERVAL '1 day'
    );