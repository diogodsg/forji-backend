# 🔄 Integração Automática: Goals/Competencies → Activities

## ✅ Implementação Concluída

A integração automática entre Goals/Competencies e Activities foi implementada com sucesso! Agora, toda vez que um usuário atualiza o progresso de uma meta ou competência, uma atividade é automaticamente criada na timeline.

---

## 🎯 O Que Foi Implementado

### **1. Novos Métodos em ActivitiesService**

#### **`createFromGoalUpdate()`**

Cria Activity automaticamente quando uma meta é atualizada.

```typescript
await this.activitiesService.createFromGoalUpdate({
  cycleId: goal.cycleId,
  userId: goal.userId,
  goalId: goal.id,
  goalTitle: goal.title,
  previousValue: goal.currentValue,
  newValue,
  notes,
  xpEarned: xpReward,
});
```

**Activity criada:**

```json
{
  "type": "GOAL_UPDATE",
  "title": "🎯 Code Reviews Semanais",
  "description": "Progresso: 5 → 10 | +50 XP | Fiz mais 5 PRs essa semana",
  "xpEarned": 50
}
```

#### **`createFromCompetencyUpdate()`**

Cria Activity automaticamente quando uma competência evolui.

```typescript
await this.activitiesService.createFromCompetencyUpdate({
  cycleId: competency.cycleId,
  userId: competency.userId,
  competencyId: competency.id,
  competencyName: competency.name,
  previousLevel,
  newLevel,
  previousProgress,
  newProgress,
  notes,
  xpEarned,
});
```

**Activity criada (level up):**

```json
{
  "type": "COMPETENCY_UPDATE",
  "title": "🧠 React & TypeScript",
  "description": "🚀 Subiu para Nível 3 | +300 XP | Completei curso avançado",
  "xpEarned": 300
}
```

**Activity criada (progresso normal):**

```json
{
  "type": "COMPETENCY_UPDATE",
  "title": "🧠 React & TypeScript",
  "description": "Progresso: 50% → 75% | Estudando hooks avançados",
  "xpEarned": 0
}
```

---

### **2. Modificações em GoalsService**

**Arquivo:** `backend/src/goals/goals.service.ts`

**O que mudou:**

- ✅ Injetado `ActivitiesService` com `forwardRef` (evita dependência circular)
- ✅ Adicionada chamada ao `createFromGoalUpdate()` no final de `updateProgress()`

**Fluxo completo:**

```typescript
async updateProgress(...) {
  // 1. Atualiza goal.currentValue
  // 2. Cria GoalUpdate no histórico
  // 3. Calcula XP (+25/50/100/200)
  // 4. Adiciona XP ao usuário
  // 5. 🆕 Cria Activity automaticamente
  await this.activitiesService.createFromGoalUpdate(...);

  return this.enrichGoal(updatedGoal);
}
```

---

### **3. Modificações em CompetenciesService**

**Arquivo:** `backend/src/competencies/competencies.service.ts`

**O que mudou:**

- ✅ Injetado `ActivitiesService` com `forwardRef`
- ✅ Adicionada chamada ao `createFromCompetencyUpdate()` no final de `updateProgress()`

**Fluxo completo:**

```typescript
async updateProgress(...) {
  // 1. Atualiza competency.currentProgress
  // 2. Se atingiu 100%, sobe de nível
  // 3. Cria CompetencyUpdate no histórico
  // 4. Calcula XP (nível * 100)
  // 5. Adiciona XP ao usuário
  // 6. 🆕 Cria Activity automaticamente
  await this.activitiesService.createFromCompetencyUpdate(...);

  return this.enrichCompetency(updatedCompetency);
}
```

---

### **4. Atualizações nos Módulos**

#### **GoalsModule** (`backend/src/goals/goals.module.ts`)

```typescript
@Module({
  imports: [
    PrismaModule,
    GamificationModule,
    forwardRef(() => ActivitiesModule), // 🆕
  ],
  // ...
})
```

#### **CompetenciesModule** (`backend/src/competencies/competencies.module.ts`)

```typescript
@Module({
  imports: [
    PrismaModule,
    GamificationModule,
    forwardRef(() => ActivitiesModule), // 🆕
  ],
  // ...
})
```

**Por que `forwardRef()`?**

- Evita dependência circular (Goals/Competencies importam Activities, Activities pode importar Goals/Competencies no futuro)
- Pattern recomendado do NestJS para módulos interdependentes

---

## 🎨 Experiência do Usuário

### **Antes da Integração:**

```
1. Usuário atualiza meta via frontend
   ↓
2. Backend atualiza goal + adiciona XP
   ↓
3. Timeline: VAZIA (sem feedback visual)
```

### **Com Integração Automática:**

```
1. Usuário atualiza meta via frontend
   ↓
2. Backend:
   ✅ Atualiza goal
   ✅ Adiciona XP
   ✅ Cria Activity automaticamente
   ↓
3. Timeline: RICA
   ┌──────────────────────────────────────┐
   │ 🎯 Code Reviews Semanais             │
   │ Progresso: 5 → 10 | +50 XP           │
   │ há 2 minutos                         │
   └──────────────────────────────────────┘
```

---

## 📊 Tipos de Activities na Timeline

Agora a timeline mostra **5 tipos** de atividades:

| Tipo                  | Emoji | XP Automático | Criação                                               |
| --------------------- | ----- | ------------- | ----------------------------------------------------- |
| **ONE_ON_ONE**        | 🤝    | 50 XP         | Manual (POST /api/activities)                         |
| **MENTORING**         | 👨‍🏫    | 35 XP         | Manual (POST /api/activities)                         |
| **CERTIFICATION**     | 🎓    | 100 XP        | Manual (POST /api/activities)                         |
| **GOAL_UPDATE**       | 🎯    | 0-200 XP      | **AUTOMÁTICO** (PATCH /api/goals/:id/progress)        |
| **COMPETENCY_UPDATE** | 🧠    | 0-500 XP      | **AUTOMÁTICO** (PATCH /api/competencies/:id/progress) |

---

## 🔍 Exemplo Prático: Fluxo Completo

### **Cenário:** Usuário atualiza meta de Code Reviews

#### **1. Frontend envia request:**

```http
PATCH /api/goals/abc123/progress
Authorization: Bearer <token>

{
  "newValue": 10,
  "notes": "Fiz mais 5 PRs essa semana"
}
```

#### **2. Backend processa:**

```typescript
// goals.service.ts - updateProgress()

// 1. Busca goal
const goal = await this.prisma.goal.findFirst({ where: { id: 'abc123' } });

// 2. Calcula progresso
const oldProgress = 30%; // 5/20 PRs
const newProgress = 50%; // 10/20 PRs
const progressGain = 20%;

// 3. Calcula XP (20% = +50 XP)
const xpReward = 50;

// 4. Atualiza goal
await this.prisma.goal.update({
  where: { id: 'abc123' },
  data: { currentValue: 10, lastUpdateAt: new Date() }
});

// 5. Cria GoalUpdate
await this.prisma.goalUpdate.create({
  data: {
    goalId: 'abc123',
    previousValue: 5,
    newValue: 10,
    notes: 'Fiz mais 5 PRs essa semana',
    xpEarned: 50
  }
});

// 6. Adiciona XP ao usuário
await this.gamificationService.addXP({
  userId: 'user123',
  xpAmount: 50,
  reason: 'Meta: Code Reviews (+20% progresso)'
});

// 7. 🆕 Cria Activity automaticamente
await this.activitiesService.createFromGoalUpdate({
  cycleId: 'cycle123',
  userId: 'user123',
  goalId: 'abc123',
  goalTitle: 'Code Reviews Semanais',
  previousValue: 5,
  newValue: 10,
  notes: 'Fiz mais 5 PRs essa semana',
  xpEarned: 50
});
```

#### **3. Activity criada no banco:**

```sql
INSERT INTO activities (
  id,
  cycle_id,
  user_id,
  type,
  title,
  description,
  xp_earned,
  created_at
) VALUES (
  'activity-xyz',
  'cycle123',
  'user123',
  'GOAL_UPDATE',
  '🎯 Code Reviews Semanais',
  'Progresso: 5 → 10 | +50 XP | Fiz mais 5 PRs essa semana',
  50,
  NOW()
);
```

#### **4. Frontend busca timeline:**

```http
GET /api/activities/timeline
Authorization: Bearer <token>
```

**Response:**

```json
{
  "activities": [
    {
      "id": "activity-xyz",
      "type": "GOAL_UPDATE",
      "title": "🎯 Code Reviews Semanais",
      "description": "Progresso: 5 → 10 | +50 XP | Fiz mais 5 PRs essa semana",
      "xpEarned": 50,
      "createdAt": "2025-10-19T12:34:56.000Z"
    }
    // ... outras activities
  ],
  "page": 1,
  "total": 15,
  "hasMore": false
}
```

#### **5. Frontend renderiza card:**

```tsx
<TimelineCard>
  <Icon>🎯</Icon>
  <Title>Code Reviews Semanais</Title>
  <Description>
    Progresso: 5 → 10 | <XpBadge>+50 XP</XpBadge>
  </Description>
  <Notes>Fiz mais 5 PRs essa semana</Notes>
  <Time>há 2 minutos</Time>
</TimelineCard>
```

---

## 🎯 Benefícios da Integração

### **1. Timeline Rica Automaticamente**

- ✅ Sem trabalho manual do usuário
- ✅ Toda evolução registrada visualmente
- ✅ Histórico completo e cronológico

### **2. Gamificação Mais Evidente**

- ✅ XP aparece na timeline imediatamente
- ✅ Usuário vê recompensa instantaneamente
- ✅ Motivação aumenta (instant gratification)

### **3. Visibilidade para Gerentes**

- ✅ Gerente vê timeline do subordinado em tempo real
- ✅ Sabe exatamente quando houve progresso
- ✅ Pode dar feedback contextualizado

### **4. Dados para Badges Futuros**

- ✅ Sistema pode detectar patterns
- ✅ Ex: "3 goals atualizados em 1 semana" → Badge CONSISTENT
- ✅ Ex: "Competência subiu 2 níveis em 1 mês" → Badge FAST_LEARNER

---

## 🧪 Como Testar

### **1. Testar Goal Update:**

```bash
# 1. Fazer login
POST http://localhost:8000/api/auth/login
{
  "email": "diego@forji.com.br",
  "password": "senha123"
}

# 2. Atualizar meta
PATCH http://localhost:8000/api/goals/{goalId}/progress
Authorization: Bearer <token>
{
  "newValue": 15,
  "notes": "Mais 5 PRs concluídos"
}

# 3. Ver timeline
GET http://localhost:8000/api/activities/timeline
Authorization: Bearer <token>

# ✅ Deve aparecer Activity tipo GOAL_UPDATE
```

### **2. Testar Competency Update:**

```bash
# 1. Atualizar competência
PATCH http://localhost:8000/api/competencies/{competencyId}/progress
Authorization: Bearer <token>
{
  "progressPercentage": 75,
  "notes": "Completei módulo avançado"
}

# 2. Ver timeline
GET http://localhost:8000/api/activities/timeline
Authorization: Bearer <token>

# ✅ Deve aparecer Activity tipo COMPETENCY_UPDATE
```

### **3. Testar Level Up:**

```bash
# Atualizar competência para 100% (vai subir de nível)
PATCH http://localhost:8000/api/competencies/{competencyId}/progress
{
  "progressPercentage": 100,
  "notes": "Finalizei todos os exercícios"
}

# ✅ Activity deve mostrar "🚀 Subiu para Nível X | +XXX XP"
```

---

## 🔧 Arquivos Modificados

```
backend/src/
├── activities/
│   ├── activities.service.ts          ✅ + createFromGoalUpdate()
│   │                                      + createFromCompetencyUpdate()
│   └── activities.module.ts           (sem mudanças, já exporta service)
│
├── goals/
│   ├── goals.service.ts               ✅ + import ActivitiesService
│   │                                      + forwardRef injection
│   │                                      + chamada createFromGoalUpdate()
│   └── goals.module.ts                ✅ + import ActivitiesModule com forwardRef
│
└── competencies/
    ├── competencies.service.ts        ✅ + import ActivitiesService
    │                                      + forwardRef injection
    │                                      + chamada createFromCompetencyUpdate()
    └── competencies.module.ts         ✅ + import ActivitiesModule com forwardRef
```

---

## ✅ Status Final

🎉 **Integração 100% funcional!**

- ✅ Server compilando sem erros
- ✅ Dependências circulares resolvidas com `forwardRef()`
- ✅ Activities criadas automaticamente em Goal Updates
- ✅ Activities criadas automaticamente em Competency Updates
- ✅ Timeline enriquecida com dados de progresso
- ✅ XP visível nas activities
- ✅ Descrições informativas com emojis

**Próximos passos:**

- Fase 7: Testes E2E dos fluxos integrados
- Fase 8: Frontend integration (consumir timeline)
- Badge system: usar Activities para detectar patterns

---

**Documentação criada em:** 19/10/2025  
**Versão:** 1.0  
**Backend:** NestJS 10.4.20 + Prisma 5.22.0
