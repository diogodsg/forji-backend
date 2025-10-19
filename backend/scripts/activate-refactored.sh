#!/bin/bash

# Script para ativar arquitetura refatorada
# Este script:
# 1. Move arquivos legacy para .legacy
# 2. Renomeia arquivos .refactored para versão final
# Execute com: npm run activate:refactored

echo "🚀 Ativando arquitetura refatorada..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para mover arquivo para .legacy
backup_legacy() {
  if [ -f "$1" ]; then
    mv "$1" "$1.legacy"
    echo -e "${BLUE}↻${NC} Backed up: $1 → $1.legacy"
  else
    echo -e "${YELLOW}⊘${NC} Not found: $1"
  fi
}

# Função para renomear arquivo refatorado
activate_refactored() {
  if [ -f "$1" ]; then
    # Remove .refactored do nome
    new_name="${1%.refactored.ts}.ts"
    mv "$1" "$new_name"
    echo -e "${GREEN}✓${NC} Activated: $1 → $new_name"
  else
    echo -e "${RED}✗${NC} Missing: $1"
  fi
}

# Confirmar com usuário
echo -e "${YELLOW}⚠️  ATENÇÃO: Este script irá ativar a arquitetura refatorada!${NC}"
echo ""
echo "Operações que serão realizadas:"
echo "  1. Backup dos arquivos originais (*.ts → *.ts.legacy)"
echo "  2. Ativação dos arquivos refatorados (*.refactored.ts → *.ts)"
echo ""
read -p "Deseja continuar? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${RED}✗${NC} Operação cancelada."
  exit 1
fi

echo ""
echo "Iniciando migração..."
echo ""

# Navegar para o diretório src
cd "$(dirname "$0")/../src" || exit 1

# === Users Module ===
echo "📦 Users Module:"
backup_legacy "users/users.service.ts"
backup_legacy "users/users.module.ts"
activate_refactored "users/users.service.refactored.ts"
activate_refactored "users/users.module.refactored.ts"
echo ""

# === Teams Module ===
echo "📦 Teams Module:"
backup_legacy "teams/teams.service.ts"
backup_legacy "teams/teams.module.ts"
activate_refactored "teams/teams.service.refactored.ts"
activate_refactored "teams/teams.module.refactored.ts"
echo ""

# === Workspaces Module ===
echo "📦 Workspaces Module:"
backup_legacy "workspaces/workspaces.service.ts"
backup_legacy "workspaces/workspaces.module.ts"
activate_refactored "workspaces/workspaces.service.refactored.ts"
activate_refactored "workspaces/workspaces.module.refactored.ts"
echo ""

# === Management Module ===
echo "📦 Management Module:"
backup_legacy "management/management.service.ts"
backup_legacy "management/management.module.ts"
activate_refactored "management/management.service.refactored.ts"
activate_refactored "management/management.module.refactored.ts"
echo ""

# === Auth Module ===
echo "📦 Auth Module:"
backup_legacy "auth/auth.service.ts"
backup_legacy "auth/auth.module.ts"
activate_refactored "auth/auth.service.refactored.ts"
activate_refactored "auth/auth.module.refactored.ts"
echo ""

# Atualizar app.module.ts
echo "📝 Atualizando app.module.ts..."
if [ -f "app.module.ts" ]; then
  # Remove .refactored dos imports
  sed -i "s/\.module\.refactored'/\.module'/g" app.module.ts
  echo -e "${GREEN}✓${NC} app.module.ts atualizado"
else
  echo -e "${RED}✗${NC} app.module.ts não encontrado"
fi
echo ""

echo -e "${GREEN}✅ Migração concluída!${NC}"
echo ""
echo "Próximos passos:"
echo "1. Verificar que app.module.ts está correto"
echo "2. Executar testes: npm test"
echo "3. Executar aplicação: npm run dev"
echo ""
echo "Para reverter, execute: npm run rollback:refactored"
