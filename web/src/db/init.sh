#!/bin/bash

# --- Configurações ---
CONTAINER_NAME="postgres-timbu"
CUSTOM_IMAGE_NAME="postgres-timbu-br"
DB_USER="timbu"
DB_NAME="timbudb"
DB_VOLUME_NAME="postgres-timbu-data" # NOME DO NOSSO VOLUME DOCKER
HOST_PORT="5432"
DDL_SCRIPT_PATH="ddl/base.sql"
AUTH_SCRIPT_PATH="ddl/auth.sql"
INSERTS_SCRIPT_PATH="init/inserts.sql"
AUTH_INSERTS_SCRIPT_PATH="init/auth_inserts.sql"

# Cores para o output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# --- Funções ---
check_docker() {
    if ! [ -x "$(command -v docker)" ]; then
        echo -e "${RED}Erro: Docker não está instalado ou não está no PATH.${NC}" >&2
        exit 1
    fi
}

# --- Script Principal ---
check_docker

# Verifica se a imagem customizada com locale pt_BR existe, e a constrói se não existir.
if ! docker image inspect "$CUSTOM_IMAGE_NAME" &> /dev/null; then
    echo -e "${YELLOW}Imagem Docker customizada ('${CUSTOM_IMAGE_NAME}') não encontrada.${NC}"
    echo "🔧 Construindo a imagem a partir do Dockerfile. Isto pode levar um minuto..."
    docker build -t "$CUSTOM_IMAGE_NAME" .
    if [ $? -ne 0 ]; then
        echo -e "${RED}Falha ao construir a imagem Docker. Verifique o Dockerfile e a sua conexão com a internet.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Imagem customizada construída com sucesso!${NC}"
fi

echo -e "${GREEN}Iniciando a configuração do ambiente PostgreSQL...${NC}"

# 1. Gerar uma senha segura
echo "🔑 Gerando uma senha segura..."
PASSWORD="timbu@123" # Senha fixa para facilitar desenvolvimento local
# PASSWORD=$(openssl rand -base64 12) # Senha aleatória (descomente para usar)
if [ -z "$PASSWORD" ]; then
    echo -e "${RED}Falha ao gerar a senha.${NC}"
    exit 1
fi

# 2. Parar e remover container antigo, se existir (o script de limpeza faz isto de forma mais completa)
echo -e "${YELLOW}Limpando ambiente antigo... (use rm.sh para limpeza completa de volumes)${NC}"
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    docker stop "$CONTAINER_NAME" > /dev/null
fi
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    docker rm "$CONTAINER_NAME" > /dev/null
fi

# 3. Iniciar o container Docker com PostgreSQL
echo "🚀 Iniciando o container Docker '${CONTAINER_NAME}' com volume nomeado..."
# ALTERADO: A flag '-v' agora usa um volume nomeado, que resolve os problemas de permissão.
docker run --name "$CONTAINER_NAME" \
    -e POSTGRES_USER="$DB_USER" \
    -e POSTGRES_PASSWORD="$PASSWORD" \
    -e POSTGRES_DB="$DB_NAME" \
    -v ${DB_VOLUME_NAME}:/var/lib/postgresql/data \
    -p ${HOST_PORT}:5432 \
    -d "$CUSTOM_IMAGE_NAME"

# Verificar se o container subiu corretamente
if [ $? -ne 0 ]; then
    echo -e "${RED}Falha ao iniciar o container Docker. Verifique as mensagens de erro acima.${NC}"
    exit 1
fi

# 4. Aguardar o PostgreSQL estar pronto para aceitar conexões
echo "⏳ Aguardando o banco de dados ficar pronto..."
sleep 5
until docker exec "$CONTAINER_NAME" pg_isready -U "$DB_USER" -d "$DB_NAME" -q; do
    if ! docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
        echo -e "${RED}Erro: O container parou de funcionar inesperadamente.${NC}"
        echo -e "${YELLOW}Verifique os logs do container com o comando:${NC}"
        echo -e "docker logs ${CONTAINER_NAME}"
        exit 1
    fi
    echo "   - Banco de dados ainda não está pronto. Tentando novamente em 2 segundos..."
    sleep 2
done

echo -e "${GREEN}✅ Banco de dados está pronto!${NC}"

# 5. Executar os scripts SQL
echo "📜 Executando scripts SQL..."

# Executar DDL Base (estrutura principal)
if [ -f "$DDL_SCRIPT_PATH" ]; then
    echo "   - Executando DDL Base: ${DDL_SCRIPT_PATH}"
    docker cp "$DDL_SCRIPT_PATH" "${CONTAINER_NAME}:/tmp/base.sql"
    docker exec -u postgres "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" -f /tmp/base.sql -v ON_ERROR_STOP=0
    if [ $? -ne 0 ]; then
        echo -e "${YELLOW}Alguns erros ocorreram no DDL Base, mas continuando...${NC}"
    fi
else
    echo -e "${YELLOW}Aviso: Script DDL Base '${DDL_SCRIPT_PATH}' não encontrado.${NC}"
fi

# Executar DDL Auth (tabelas de autenticação)
if [ -f "$AUTH_SCRIPT_PATH" ]; then
    echo "   - Executando DDL Auth: ${AUTH_SCRIPT_PATH}"
    docker cp "$AUTH_SCRIPT_PATH" "${CONTAINER_NAME}:/tmp/auth.sql"
    docker exec -u postgres "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" -f /tmp/auth.sql -v ON_ERROR_STOP=0
    if [ $? -ne 0 ]; then
        echo -e "${YELLOW}Alguns erros ocorreram no DDL Auth, mas continuando...${NC}"
    fi
else
    echo -e "${YELLOW}Aviso: Script DDL Auth '${AUTH_SCRIPT_PATH}' não encontrado.${NC}"
fi

# Executar Inserts Base (dados dos projetos)
if [ -f "$INSERTS_SCRIPT_PATH" ]; then
    echo "   - Executando Inserts Base: ${INSERTS_SCRIPT_PATH}"
    docker cp "$INSERTS_SCRIPT_PATH" "${CONTAINER_NAME}:/tmp/inserts.sql"
    docker exec -u postgres "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" -f /tmp/inserts.sql -v ON_ERROR_STOP=0
    if [ $? -ne 0 ]; then
        echo -e "${YELLOW}Alguns erros ocorreram nos Inserts Base, mas continuando...${NC}"
    fi
else
    echo -e "${YELLOW}Aviso: Script de Inserts Base '${INSERTS_SCRIPT_PATH}' não encontrado.${NC}"
fi

# Executar Inserts Auth (dados de usuários e autenticação)
if [ -f "$AUTH_INSERTS_SCRIPT_PATH" ]; then
    echo "   - Executando Inserts Auth: ${AUTH_INSERTS_SCRIPT_PATH}"
    docker cp "$AUTH_INSERTS_SCRIPT_PATH" "${CONTAINER_NAME}:/tmp/auth_inserts.sql"
    docker exec -u postgres "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" -f /tmp/auth_inserts.sql -v ON_ERROR_STOP=0
    if [ $? -ne 0 ]; then
        echo -e "${YELLOW}Alguns erros ocorreram nos Inserts Auth, mas continuando...${NC}"
    fi
else
    echo -e "${YELLOW}Aviso: Script de Inserts Auth '${AUTH_INSERTS_SCRIPT_PATH}' não encontrado.${NC}"
fi

# Monta a URL de conexão
DATABASE_URL="postgresql://${DB_USER}:${PASSWORD}@localhost:${HOST_PORT}/${DB_NAME}"

echo -e "\n${GREEN}🎉 Configuração concluída com sucesso!${NC}"
echo "--------------------------------------------------"
echo -e "Detalhes do Banco de Dados:"
echo -e "  ${YELLOW}Host:${NC}         localhost"
echo -e "  ${YELLOW}Porta:${NC}        ${HOST_PORT}"
echo -e "  ${YELLOW}Usuário:${NC}      ${DB_USER}"
echo -e "  ${YELLOW}Banco:${NC}        ${DB_NAME}"
echo -e "  ${YELLOW}Locale:${NC}       pt_BR.UTF-8"
echo -e "  ${YELLOW}Senha:${NC}         ${PASSWORD}"
echo -e "  ${YELLOW}URL:${NC}          ${DATABASE_URL}"
echo "--------------------------------------------------"
echo -e "${GREEN}Tabelas criadas:${NC}"
echo -e "  📋 Principais: projetos, requisicao, ordem, contrato"
echo -e "  👥 Autenticação: users, accounts, sessions, profiles"
echo -e "  🔐 Permissões: user_projects, activity_logs"
echo -e "  ✅ Dados de exemplo carregados para todas as tabelas"
echo "--------------------------------------------------"
echo "Para se conectar, use o comando:"
echo -e "${YELLOW}PGPASSWORD='${PASSWORD}' psql -h localhost -p ${HOST_PORT} -U ${DB_USER} -d ${DB_NAME}${NC}"
echo "--------------------------------------------------"

