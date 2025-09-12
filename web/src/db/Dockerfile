# Dockerfile
# Usa a imagem oficial do PostgreSQL como base
FROM postgres:17.6

# Define o frontend como não interativo para evitar prompts durante a instalação
ENV DEBIAN_FRONTEND=noninteractive

# Atualiza, instala locales, configura, gera e limpa em uma única camada
RUN apt-get update && \
    apt-get install -y --no-install-recommends locales && \
    sed -i '/pt_BR.UTF-8/s/^# //g' /etc/locale.gen && \
    locale-gen pt_BR.UTF-8 && \
    apt-get purge -y --auto-remove && \
    rm -rf /var/lib/apt/lists/*

# Define as variáveis de ambiente para que o novo locale seja o padrão
ENV LANG=pt_BR.UTF-8
ENV LANGUAGE=pt_BR:pt
ENV LC_ALL=pt_BR.UTF-8
