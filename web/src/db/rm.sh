#!/bin/bash

# --- Configurações ---
CONTAINER_NAME="postgres-timbu"
DB_VOLUME_NAME="postgres-timbu-data" # NOME DO VOLUME A SER REMOVIDO

# Cores
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${YELLOW}Iniciando limpeza completa do ambiente PostgreSQL...${NC}"

# 1. Parar o container
echo "🛑 Parando o container '${CONTAINER_NAME}'..."
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    docker stop "$CONTAINER_NAME"
else
    echo "   - Container não está em execução."
fi

# 2. Remover o container
echo "🗑️  Removendo o container '${CONTAINER_NAME}'..."
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    docker rm "$CONTAINER_NAME"
else
    echo "   - Container não encontrado."
fi

# 3. Remover o volume nomeado
echo "🔥 Removendo o volume de dados '${DB_VOLUME_NAME}'..."
if [ "$(docker volume ls -q -f name=$DB_VOLUME_NAME)" ]; then
    docker volume rm "$DB_VOLUME_NAME"
else
    echo "   - Volume não encontrado."
fi

echo -e "\n${GREEN}✅ Limpeza concluída com sucesso!${NC}"
