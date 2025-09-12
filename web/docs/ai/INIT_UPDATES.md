# Atualizações do Script de Inicialização do Banco de Dados

## Resumo das Modificações

O script `init.sh` foi atualizado para incluir suporte completo ao sistema de autenticação do projeto **Contratos Timbu**.

## Mudanças Implementadas

### 1. Configurações Atualizadas

- Adicionadas variáveis para os novos scripts SQL:
  - `AUTH_SCRIPT_PATH="ddl/auth.sql"`
  - `AUTH_INSERTS_SCRIPT_PATH="init/auth_inserts.sql"`

### 2. Execução Sequencial dos Scripts

O script agora executa os arquivos SQL na ordem correta, respeitando as dependências:

1. **DDL Base** (`ddl/base.sql`)
   - Cria as tabelas principais: projetos, requisicao, ordem, contrato, etc.

2. **DDL Auth** (`ddl/auth.sql`)
   - Cria o sistema de autenticação baseado em NextAuth.js v5
   - Tabelas: users, accounts, sessions, verification_tokens, profiles, user_projects, activity_logs
   - Inclui foreign keys para a tabela `projetos`

3. **Inserts Base** (`init/inserts.sql`)
   - Carrega dados de exemplo para as tabelas principais
   - Contém 54 projetos de exemplo

4. **Inserts Auth** (`init/auth_inserts.sql`)
   - Carrega usuários de exemplo com diferentes roles
   - Associa usuários aos projetos existentes
   - Inclui logs de atividade e sessões de exemplo

### 3. Melhorias no Controle de Erros

- Verificação de erro após cada execução de script
- Mensagens de erro claras com instruções
- Saída do script em caso de falha

### 4. Melhorias na Saída

- Informações detalhadas sobre as tabelas criadas
- Listagem das funcionalidades implementadas
- Confirmação visual do sucesso da operação

### 5. Correções nos Arquivos SQL

- Adicionado `BEGIN;` no início do arquivo `auth_inserts.sql`
- Descomentado `BEGIN;` e `COMMIT;` no arquivo `inserts.sql`
- Garantia de transações consistentes

## Estrutura do Sistema de Autenticação

### Tabelas Principais

- **users**: Informações básicas dos usuários
- **accounts**: Contas OAuth (Google, GitHub, etc.)
- **sessions**: Sessões ativas dos usuários
- **verification_tokens**: Tokens para verificação de email
- **profiles**: Perfis estendidos dos usuários
- **user_projects**: Associação usuário-projeto com roles
- **activity_logs**: Logs de atividades do sistema

### Roles Disponíveis

- **ADMIN**: Acesso total ao sistema
- **USER**: Usuário padrão
- **OWNER**: Proprietário do projeto
- **MANAGER**: Gerente do projeto
- **EDITOR**: Editor do projeto
- **VIEWER**: Visualizador do projeto

### Usuários de Exemplo Criados

1. **João Silva** (Admin) - `joao.silva@contratostimbu.com`
2. **Maria Santos** (Manager) - `maria.santos@contratostimbu.com`
3. **Pedro Costa** (Developer) - `pedro.costa@contratostimbu.com`
4. **Ana Oliveira** (Finance) - `ana.oliveira@contratostimbu.com`
5. **Carlos Ferreira** (Support) - `carlos.ferreira@contratostimbu.com`

## Como Usar

Execute o script normalmente:

```bash
cd src/db
./init.sh
```

O script agora configurará automaticamente:

- Banco de dados PostgreSQL com locale pt_BR
- Estrutura completa de tabelas
- Sistema de autenticação funcional
- Dados de exemplo para desenvolvimento

## Benefícios

1. **Setup Completo**: Um único comando configura todo o ambiente
2. **Desenvolvimento Ágil**: Dados de exemplo já configurados
3. **Autenticação Pronta**: Sistema NextAuth.js funcional
4. **Controle de Acesso**: Permissões por projeto implementadas
5. **Logs de Auditoria**: Rastreamento de atividades dos usuários

## Compatibilidade

- ✅ PostgreSQL 12+
- ✅ NextAuth.js v5 (Auth.js)
- ✅ Drizzle ORM
- ✅ Docker
- ✅ Locale pt_BR.UTF-8
