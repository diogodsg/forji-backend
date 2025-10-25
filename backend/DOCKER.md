# 🐳 Docker Setup - Forge Backend

Este documento descreve como configurar e executar o Forge Backend usando Docker.

## 📋 Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) (versão 20.10 ou superior)
- [Docker Compose](https://docs.docker.com/compose/install/) (versão 2.0 ou superior)

## 🚀 Quick Start

### 1. Configuração Inicial

```bash
# Clonar repositório (se ainda não fez)
git clone <repository-url>
cd forge/backend

# Tornar script executável
chmod +x docker-deploy.sh

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env conforme necessário
```

### 2. Executar em Desenvolvimento

```bash
# Iniciar com hot reload
./docker-deploy.sh dev

# Ou usando docker-compose diretamente
docker-compose --profile development up --build
```

### 3. Executar em Produção

```bash
# Iniciar em produção
./docker-deploy.sh prod

# Ou usando docker-compose diretamente
docker-compose up --build -d backend postgres
```

## 🛠️ Comandos Disponíveis

### Script de Deploy (`./docker-deploy.sh`)

| Comando | Descrição |
|---------|-----------|
| `dev` | Iniciar em modo desenvolvimento com hot reload |
| `prod` | Iniciar em modo produção |
| `build` | Fazer build da imagem Docker |
| `migrate` | Executar migrações do Prisma |
| `seed` | Executar seed do banco de dados |
| `logs` | Mostrar logs da aplicação |
| `stop` | Parar todos os serviços |
| `clean` | Limpar containers, images e volumes |
| `restart` | Reiniciar os serviços |
| `help` | Mostrar ajuda |

### Exemplos de Uso

```bash
# Desenvolvimento
./docker-deploy.sh dev
./docker-deploy.sh logs

# Produção
./docker-deploy.sh prod
./docker-deploy.sh migrate
./docker-deploy.sh seed

# Manutenção
./docker-deploy.sh restart
./docker-deploy.sh clean
```

## 🏗️ Arquitetura Docker

### Multi-stage Build

O Dockerfile usa multi-stage build para otimizar a imagem final:

1. **Base**: Configuração base do Node.js
2. **Dependencies**: Instalação de dependências
3. **Builder**: Build da aplicação
4. **Production**: Imagem final otimizada

### Serviços

| Serviço | Porta | Descrição |
|---------|--------|-----------|
| `postgres` | 5432 | Banco de dados PostgreSQL 15 |
| `backend` | 3001 | API NestJS (produção) |
| `backend-dev` | 3001, 9229 | API NestJS (desenvolvimento + debug) |

## 🔧 Configuração

### Variáveis de Ambiente

Principais variáveis no arquivo `.env`:

```env
# Database
DATABASE_URL=postgresql://forge_user:forge_password@postgres:5432/forge_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Application
NODE_ENV=production
PORT=3001

# CORS
FRONTEND_URL=http://localhost:3000
```

### Volumes

- **postgres_data**: Dados persistentes do PostgreSQL
- **Desenvolvimento**: Mount do código fonte para hot reload

### Networks

- **forge-network**: Rede interna para comunicação entre serviços

## 🔍 Debug e Logs

### Ver Logs

```bash
# Logs de todos os serviços
docker-compose logs -f

# Logs apenas do backend
docker-compose logs -f backend

# Logs do PostgreSQL
docker-compose logs -f postgres
```

### Debug Mode (Desenvolvimento)

```bash
# Iniciar em modo debug
./docker-deploy.sh dev

# Conectar debugger na porta 9229
# Usar VS Code ou outro debugger
```

### Acessar Container

```bash
# Entrar no container do backend
docker-compose exec backend sh

# Entrar no container do PostgreSQL
docker-compose exec postgres psql -U forge_user -d forge_db
```

## 📊 Health Checks

### Backend

```bash
# Verificar se está respondendo
curl http://localhost:3001/health

# Verificar via Docker
docker-compose ps
```

### Banco de Dados

```bash
# Status do PostgreSQL
docker-compose exec postgres pg_isready -U forge_user -d forge_db
```

## 🔄 Migrações e Seeds

### Executar Migrações

```bash
# Via script
./docker-deploy.sh migrate

# Via docker-compose
docker-compose exec backend npx prisma migrate deploy
```

### Executar Seeds

```bash
# Via script
./docker-deploy.sh seed

# Via docker-compose
docker-compose exec backend npm run prisma:seed
```

### Gerar Prisma Client

```bash
docker-compose exec backend npx prisma generate
```

## 🧹 Limpeza e Manutenção

### Limpeza Completa

```bash
# Remove tudo (cuidado em produção!)
./docker-deploy.sh clean
```

### Limpeza Manual

```bash
# Parar serviços
docker-compose down

# Remover volumes (dados serão perdidos!)
docker-compose down --volumes

# Limpar imagens não utilizadas
docker image prune -f
```

## 🚀 Deploy em Produção

### Recomendações

1. **Secrets**: Use secrets manager para JWT_SECRET
2. **Database**: Use RDS ou similar em produção
3. **Logs**: Configure log aggregation
4. **Monitoring**: Adicione health checks e métricas
5. **Backup**: Configure backup automático do banco

### Exemplo com Docker Swarm

```bash
# Inicializar swarm
docker swarm init

# Deploy do stack
docker stack deploy -c docker-compose.yml forge
```

### Exemplo com Kubernetes

```yaml
# Usar o Dockerfile para criar deployment no K8s
# Configurar ConfigMaps para variáveis de ambiente
# Usar Secrets para dados sensíveis
```

## 🛡️ Segurança

- Imagem baseada em Alpine Linux (menor superfície de ataque)
- Usuário não-root no container
- Health checks configurados
- Variables de ambiente para secrets
- .dockerignore para excluir arquivos sensíveis

## 📝 Troubleshooting

### Problemas Comuns

1. **Porta já em uso**: Altere as portas no docker-compose.yml
2. **Permissão negada**: Execute `chmod +x docker-deploy.sh`
3. **Banco não conecta**: Verifique se PostgreSQL está saudável
4. **Build falha**: Verifique se tem espaço em disco suficiente

### Logs Detalhados

```bash
# Logs com timestamp
docker-compose logs -f --timestamps

# Apenas erros
docker-compose logs --tail=50 backend | grep ERROR
```