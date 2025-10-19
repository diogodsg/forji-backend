#!/bin/bash

# Script para deletar arquivos legacy após migração para arquitetura refatorada
# Execute com: npm run clean:legacy

echo "🗑️  Removendo arquivos legacy..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para deletar arquivo se existir
delete_if_exists() {
  if [ -f "$1" ]; then
    rm "$1"
    echo -e "${GREEN}✓${NC} Deleted: $1"
  else
    echo -e "${YELLOW}⊘${NC} Not found: $1"
  fi
}

# Função para confirmar antes de deletar
confirm_deletion() {
  echo -e "${YELLOW}⚠️  ATENÇÃO: Este script irá deletar os arquivos legacy!${NC}"
  echo "Os seguintes arquivos serão removidos:"
  echo "  - users/users.service.ts (original)"
  echo "  - users/users.module.ts (original)"
  echo "  - teams/teams.service.ts (original)"
  echo "  - teams/teams.module.ts (original)"
  echo "  - workspaces/workspaces.service.ts (original)"
  echo "  - workspaces/workspaces.module.ts (original)"
  echo "  - management/management.service.ts (original)"
  echo "  - management/management.module.ts (original)"
  echo "  - auth/auth.service.ts (original)"
  echo "  - auth/auth.module.ts (original)"
  echo ""
  read -p "Tem certeza que deseja continuar? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}✗${NC} Operação cancelada."
    exit 1
  fi
}

# Confirmar com usuário
confirm_deletion

echo ""
echo "Iniciando remoção..."
echo ""

# Navegar para o diretório src
cd "$(dirname "$0")/../src" || exit 1

# Deletar arquivos do módulo Users
echo "📦 Users Module:"
delete_if_exists "users/users.service.ts"
delete_if_exists "users/users.module.ts"
echo ""

# Deletar arquivos do módulo Teams
echo "📦 Teams Module:"
delete_if_exists "teams/teams.service.ts"
delete_if_exists "teams/teams.module.ts"
echo ""

# Deletar arquivos do módulo Workspaces
echo "📦 Workspaces Module:"
delete_if_exists "workspaces/workspaces.service.ts"
delete_if_exists "workspaces/workspaces.module.ts"
echo ""

# Deletar arquivos do módulo Management
echo "📦 Management Module:"
delete_if_exists "management/management.service.ts"
delete_if_exists "management/management.module.ts"
echo ""

# Deletar arquivos do módulo Auth
echo "📦 Auth Module:"
delete_if_exists "auth/auth.service.ts"
delete_if_exists "auth/auth.module.ts"
echo ""

echo -e "${GREEN}✅ Limpeza concluída!${NC}"
echo ""
echo "Próximos passos:"
echo "1. Renomear arquivos .refactored para versão final:"
echo "   - users.service.refactored.ts → users.service.ts"
echo "   - users.module.refactored.ts → users.module.ts"
echo "   - (repetir para todos os módulos)"
echo ""
echo "2. Atualizar imports no app.module.ts se necessário"
echo "3. Executar testes: npm test"
echo "4. Executar aplicação: npm run dev"
