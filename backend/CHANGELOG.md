# Changelog

Todas as mudanças notáveis neste backend serão documentadas aqui.

## [Unreleased]

- Modularização futura (`AuthModule`, `PrsModule`, `PdiModule`) ainda não criada
- DTO de query para listagem de PRs
- Melhorar precisão BigInt (remover Number())

## 2025-09-14

### Adicionado

- Interceptor global `BigIntSerializationInterceptor` para serializar BigInt de forma segura
- Middleware de contexto de requisição com `requestId`
- Logger estruturado usando Pino (`common/logger/pino.ts`)
- Endpoints de métricas básicas de PR: `GET /prs/metrics`
- DTOs de autenticação e PR (`dto/auth.dto.ts`, `dto/pr.dto.ts`)
- Serviço de permissões centralizado `permissions/permission.service.ts`

### Alterado

- Refatoração dos controllers e services para pastas de domínio: `auth/`, `prs/`, `pdi/`
- Registro do primeiro usuário promove automaticamente a admin
- `DELETE /auth/admin/delete-user` agora executa com limpeza relacional (nula ownerUserId dos PRs e remove PDI)
- Simplificação de listagem de usuários (`GET /auth/users`) sem über-joins desnecessários
- Padronização de validação: `ValidationPipe` global com `whitelist`, `forbidNonWhitelisted`, `transform`
- Mapeamento de campos snake_case -> camelCase em PR centralizado em método privado

### Removido

- Endpoints granulares de PDI (milestones/tasks individuais) substituídos por operações de plano inteiro / patch
- Prototype patch de `BigInt` no `JSON` (substituído por interceptor)
- Guard mock não utilizado `mock-auth.guard.ts`
- DTOs de criação/atualização granular de PDI não usados (`CreateMilestoneDto`, `UpdateMilestoneDto`, etc.)
- Arquivos duplicados legados de controllers/services (a remover definitivamente em commit de limpeza final)

### Correções

- Ajuste de transação ao deletar usuário para evitar estados intermediários inconsistentes
- Correção de tipagem Pino + `pino-http` evitando conflito de overload

### Considerações Técnicas

- Conversão BigInt ainda usa `Number()` em `PrsService.list`: risco de precisão futura; planejar retorno como string via interceptor
- Falta organizar módulos Nest específicos (próximo passo para escalabilidade)
