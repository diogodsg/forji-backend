#!/bin/bash

# ================================
# Script de Deploy do Forge Backend
# ================================

set -e

echo "🚀 Forge Backend - Script de Deploy"
echo "=================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para logs coloridos
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    log_error "Docker não está rodando. Por favor, inicie o Docker primeiro."
    exit 1
fi

# Verificar se Docker Compose está disponível
if ! command -v docker-compose > /dev/null 2>&1; then
    log_error "Docker Compose não está instalado."
    exit 1
fi

# Função para mostrar ajuda
show_help() {
    echo "Uso: $0 [COMANDO]"
    echo ""
    echo "Comandos disponíveis:"
    echo "  dev          - Iniciar em modo desenvolvimento com hot reload"
    echo "  prod         - Iniciar em modo produção"
    echo "  build        - Fazer build da imagem Docker"
    echo "  migrate      - Executar migrações do Prisma"
    echo "  seed         - Executar seed do banco de dados"
    echo "  logs         - Mostrar logs da aplicação"
    echo "  stop         - Parar todos os serviços"
    echo "  clean        - Limpar containers, images e volumes"
    echo "  restart      - Reiniciar os serviços"
    echo "  help         - Mostrar esta ajuda"
    echo ""
}

# Função para verificar arquivo .env
check_env() {
    if [ ! -f .env ]; then
        log_warning "Arquivo .env não encontrado. Copiando .env.example..."
        if [ -f .env.example ]; then
            cp .env.example .env
            log_info "Arquivo .env criado. Por favor, configure as variáveis necessárias."
        else
            log_error "Arquivo .env.example não encontrado."
            exit 1
        fi
    fi
}

# Comandos
case "${1:-help}" in
    "dev")
        log_info "Iniciando em modo desenvolvimento..."
        check_env
        docker-compose --profile development up --build -d
        log_success "Backend em desenvolvimento rodando em http://localhost:3001"
        log_info "Para ver os logs: $0 logs"
        ;;
    
    "prod")
        log_info "Iniciando em modo produção..."
        check_env
        docker-compose up --build -d backend postgres
        log_success "Backend em produção rodando em http://localhost:3001"
        log_info "Para ver os logs: $0 logs"
        ;;
    
    "build")
        log_info "Fazendo build da imagem Docker..."
        docker-compose build --no-cache
        log_success "Build concluído!"
        ;;
    
    "migrate")
        log_info "Executando migrações do Prisma..."
        docker-compose exec backend npx prisma migrate deploy
        log_success "Migrações executadas!"
        ;;
    
    "seed")
        log_info "Executando seed do banco de dados..."
        docker-compose exec backend npm run prisma:seed
        log_success "Seed executado!"
        ;;
    
    "logs")
        log_info "Mostrando logs da aplicação..."
        docker-compose logs -f backend
        ;;
    
    "stop")
        log_info "Parando todos os serviços..."
        docker-compose down
        log_success "Serviços parados!"
        ;;
    
    "clean")
        log_warning "Isso irá remover todos os containers, imagens e volumes relacionados ao projeto!"
        read -p "Tem certeza? [y/N]: " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            log_info "Limpando containers, imagens e volumes..."
            docker-compose down --volumes --remove-orphans
            docker-compose rm -f
            docker image prune -f
            docker volume prune -f
            log_success "Limpeza concluída!"
        else
            log_info "Operação cancelada."
        fi
        ;;
    
    "restart")
        log_info "Reiniciando serviços..."
        docker-compose restart
        log_success "Serviços reiniciados!"
        ;;
    
    "help"|*)
        show_help
        ;;
esac