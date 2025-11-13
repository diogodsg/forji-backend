# ================================
# Multi-stage Dockerfile para Forji Backend
# ================================

# ================================
# Estágio 1: Base da aplicação
# ================================
FROM node:18-alpine AS base

# Instalar dependências necessárias para Prisma e builds nativos
RUN apk add --no-cache libc6-compat openssl

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# ================================
# Estágio 2: Instalação de dependências
# ================================
FROM base AS deps

# Instalar todas as dependências (incluindo devDependencies para build)
RUN npm ci --legacy-peer-deps

# Gerar Prisma Client
RUN npx prisma generate

# ================================
# Estágio 3: Build da aplicação
# ================================
FROM base AS builder

# Copiar node_modules do estágio anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fonte
COPY . .

# Gerar Prisma Client novamente (garantia)
RUN npx prisma generate

# Build da aplicação
RUN npm run build

# ================================
# Estágio 4: Produção
# ================================
FROM node:18-alpine AS production

# Instalar dependências do sistema necessárias
RUN apk add --no-cache \
    openssl \
    libc6-compat \
    && addgroup -g 1001 -S nodejs \
    && adduser -S nestjs -u 1001

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json para instalar apenas dependências de produção
COPY package*.json ./

# Instalar apenas dependências de produção
RUN npm ci --omit=dev --legacy-peer-deps && npm cache clean --force

# Copiar Prisma schema e gerar client para produção
COPY prisma ./prisma/
RUN npx prisma generate

# Copiar aplicação buildada
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

# Copiar scripts se existirem
COPY --from=builder --chown=nestjs:nodejs /app/scripts ./scripts

# Mudar para usuário não-root por segurança
USER nestjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node --version || exit 1

# Comando para iniciar a aplicação
CMD ["node", "dist/src/main.js"]

EXPOSE 8000
