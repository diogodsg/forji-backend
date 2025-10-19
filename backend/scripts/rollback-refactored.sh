#!/bin/bash

# Script para reverter para arquitetura legacy
# Este script desfaz as mudanças do activate-refactored.sh
# Execute com: npm run rollback:refactored

echo "⏪ Revertendo para arquitetura legacy..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para restaurar arquivo legacy
restore_legacy() {
  if [ -f "$1.legacy" ]; then
    # Se existir arquivo atual (refatorado), move para .refactored
    if [ -f "$1" ]; then
      mv "$1" "${1%.ts}.refactored.ts"
      echo -e "${BLUE}↻${NC} Moved current: $1 → ${1%.ts}.refactored.ts"
    fi
    # Restaura legacy
    mv "$1.legacy" "$1"
    echo -e "${GREEN}✓${NC} Restored: $1.legacy → $1"
  else
    echo -e "${YELLOW}⊘${NC} No backup found: $1.legacy"
  fi
}

# Confirmar com usuário
echo -e "${YELLOW}⚠️  ATENÇÃO: Este script irá reverter para a arquitetura legacy!${NC}"
echo ""
echo "Operações que serão realizadas:"
echo "  1. Restauração dos arquivos legacy (*.ts.legacy → *.ts)"
echo "  2. Backup dos arquivos refatorados (*.ts → *.refactored.ts)"
echo ""
read -p "Deseja continuar? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${RED}✗${NC} Operação cancelada."
  exit 1
fi

echo ""
echo "Iniciando rollback..."
echo ""

# Navegar para o diretório src
cd "$(dirname "$0")/../src" || exit 1

# === Users Module ===
echo "📦 Users Module:"
restore_legacy "users/users.service.ts"
restore_legacy "users/users.module.ts"
echo ""

# === Teams Module ===
echo "📦 Teams Module:"
restore_legacy "teams/teams.service.ts"
restore_legacy "teams/teams.module.ts"
echo ""

# === Workspaces Module ===
echo "📦 Workspaces Module:"
restore_legacy "workspaces/workspaces.service.ts"
restore_legacy "workspaces/workspaces.module.ts"
echo ""

# === Management Module ===
echo "📦 Management Module:"
restore_legacy "management/management.service.ts"
restore_legacy "management/management.module.ts"
echo ""

# === Auth Module ===
echo "📦 Auth Module:"
restore_legacy "auth/auth.service.ts"
restore_legacy "auth/auth.module.ts"
echo ""

# Atualizar app.module.ts
echo "📝 Atualizando app.module.ts..."
if [ -f "app.module.ts" ]; then
  # Remove .refactored dos imports (caso estejam)
  sed -i "s/\.module\.refactored'/\.module'/g" app.module.ts
  echo -e "${GREEN}✓${NC} app.module.ts atualizado"
else
  echo -e "${RED}✗${NC} app.module.ts não encontrado"
fi
echo ""

echo -e "${GREEN}✅ Rollback concluído!${NC}"
echo ""
echo "Sistema restaurado para arquitetura legacy."
echo "Execute: npm run dev"
