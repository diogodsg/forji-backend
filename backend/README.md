# Forge Backend

API NestJS mockada para MVP do Forge.

## Endpoints

- `/prs` - CRUD de Pull Requests (dados em memória)
- `/pdi` - CRUD de PDI por usuário (dados em memória)

Todos os endpoints usam autenticação mock (qualquer requisição é autenticada como usuário de teste).

## Como rodar

```bash
cd backend
npm install
npm run start:dev
```

## Observações

- Não há persistência: todos os dados são resetados ao reiniciar.
- Estrutura e tipos são simplificados para MVP.
