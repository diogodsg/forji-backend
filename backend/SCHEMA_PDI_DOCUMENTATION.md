# 📊 Schema PDI & Gamification - Documentação Técnica

**Data:** 19 de outubro de 2025  
**Versão:** 1.0.0  
**Autor:** Backend Team - Forji

---

## 🎯 Visão Geral

Este documento detalha o schema Prisma criado para suportar o sistema de **PDI (Plano de Desenvolvimento Individual)** e **Gamificação** da plataforma Forji.

### **Novos Módulos Adicionados:**

1. **Gamification** - XP, níveis, badges e streaks
2. **Cycles** - Ciclos de desenvolvimento (trimestrais/semestrais)
3. **Goals** - Metas e objetivos mensuráveis
4. **Competencies** - Habilidades técnicas e comportamentais
5. **Activities** - Timeline de eventos (1:1s, mentorias, certificações)

**Total de novos modelos:** 12  
**Total de novos enums:** 5  
**Linhas adicionadas:** ~350

---

## 📦 1. Gamification Module

### **GamificationProfile**

Perfil de gamificação único por usuário com sistema de XP e níveis.

```prisma
model GamificationProfile {
  id            String   @id @default(uuid()) @db.Uuid
  userId        String   @unique @map("user_id") @db.Uuid
  level         Int      @default(1)
  currentXP     Int      @default(0) @map("current_xp")
  totalXP       Int      @default(0) @map("total_xp")
  streak        Int      @default(0)
  lastActiveAt  DateTime @default(now()) @map("last_active_at")
}
```

**Campos:**

- `userId` - Relacionamento 1:1 com User
- `level` - Nível atual do usuário (calculado baseado em totalXP)
- `currentXP` - XP no nível atual (reseta ao subir de nível)
- `totalXP` - XP acumulado total (nunca diminui)
- `streak` - Dias consecutivos com atividade
- `lastActiveAt` - Última atividade registrada (para cálculo de streak)

**Fórmula de Nível:**

```typescript
level = Math.floor(Math.sqrt(totalXP / 100));

// Exemplos:
// 100 XP = Nível 1
// 400 XP = Nível 2
// 900 XP = Nível 3
// 2500 XP = Nível 5
```

**Lógica de Streak:**

- Se `lastActiveAt` > 24h atrás → Resetar streak para 0
- Se atividade dentro de 24h → Manter streak
- Se nova atividade hoje após 24h+ → Incrementar streak

---

### **Badge**

Conquistas desbloqueadas pelo usuário baseadas em ações.

```prisma
model Badge {
  id                     String   @id @default(uuid()) @db.Uuid
  gamificationProfileId  String   @map("gamification_profile_id") @db.Uuid
  type                   BadgeType
  name                   String
  description            String?
  earnedAt               DateTime @default(now()) @map("earned_at")
}
```

**BadgeType (Enum):**

```prisma
enum BadgeType {
  STREAK_7         // 7 dias de streak
  STREAK_30        // 30 dias de streak
  STREAK_100       // 100 dias de streak
  GOAL_MASTER      // Completou 10 metas
  MENTOR           // Realizou 5 mentorias
  CERTIFIED        // Obteve 3 certificações
  TEAM_PLAYER      // Realizou 10 1:1s
  FAST_LEARNER     // Subiu 3 níveis em uma competência
  CONSISTENT       // Atualizou metas por 30 dias seguidos
}
```

**Triggers de Desbloqueio (Implementar no backend):**

- STREAK_7: Quando `streak === 7`
- GOAL_MASTER: Quando completar 10ª meta
- MENTOR: Quando criar 5ª mentoria
- Etc.

---

## 📦 2. Cycles Module

### **Cycle**

Representa um ciclo de desenvolvimento (ex: "Q4 2024 - Excelência Técnica").

```prisma
model Cycle {
  id           String      @id @default(uuid()) @db.Uuid
  workspaceId  String      @map("workspace_id") @db.Uuid
  name         String
  description  String?
  startDate    DateTime    @map("start_date")
  endDate      DateTime    @map("end_date")
  status       CycleStatus @default(ACTIVE)
}
```

**CycleStatus (Enum):**

```prisma
enum CycleStatus {
  DRAFT      // Rascunho, ainda não iniciado
  ACTIVE     // Ciclo ativo
  COMPLETED  // Ciclo finalizado
  ARCHIVED   // Arquivado
}
```

**Regras de Negócio:**

- ✅ Apenas 1 ciclo `ACTIVE` por workspace por vez
- ✅ `endDate` deve ser > `startDate`
- ✅ Ciclos `COMPLETED` ou `ARCHIVED` não podem ser editados
- ✅ Todos os goals/competencies/activities pertencem a um ciclo

**Relacionamentos:**

- 1 Cycle → N Goals
- 1 Cycle → N Competencies
- 1 Cycle → N Activities

---

## 📦 3. Goals Module

### **Goal**

Meta mensurável dentro de um ciclo.

```prisma
model Goal {
  id           String     @id @default(uuid()) @db.Uuid
  cycleId      String     @map("cycle_id") @db.Uuid
  userId       String     @map("user_id") @db.Uuid
  title        String
  description  String?
  type         GoalType
  status       GoalStatus @default(ACTIVE)
  currentValue Float?     @map("current_value")
  targetValue  Float?     @map("target_value")
  startValue   Float?     @map("start_value")
  unit         String?
  lastUpdateAt DateTime?  @map("last_update_at")
}
```

**GoalType (Enum):**

```prisma
enum GoalType {
  INCREASE      // Aumentar valor (ex: PRs de 0 para 15)
  DECREASE      // Diminuir valor (ex: bugs de 20 para 10)
  PERCENTAGE    // Atingir % (ex: cobertura de testes 90%)
  BINARY        // Sim/Não (ex: obter certificação)
}
```

**Cálculo de Progresso (%):**

```typescript
function calculateProgress(goal: Goal): number {
  switch (goal.type) {
    case 'INCREASE':
      // Ex: De 0 para 15 PRs, atual 9 = 60%
      return ((goal.currentValue - goal.startValue) / (goal.targetValue - goal.startValue)) * 100;

    case 'DECREASE':
      // Ex: De 20 para 10 bugs, atual 15 = 50%
      return ((goal.startValue - goal.currentValue) / (goal.startValue - goal.targetValue)) * 100;

    case 'PERCENTAGE':
      // Ex: Atingir 90% cobertura, atual 78% = 78%
      return goal.currentValue;

    case 'BINARY':
      // Ex: Obter certificação = 0% ou 100%
      return goal.status === 'COMPLETED' ? 100 : 0;
  }
}
```

---

### **GoalUpdate**

Histórico de atualizações de uma meta.

```prisma
model GoalUpdate {
  id            String   @id @default(uuid()) @db.Uuid
  goalId        String   @map("goal_id") @db.Uuid
  previousValue Float?   @map("previous_value")
  newValue      Float?   @map("new_value")
  notes         String?  @db.Text
  xpEarned      Int      @default(0) @map("xp_earned")
  createdAt     DateTime @default(now()) @map("created_at")
}
```

**Lógica de XP por Atualização:**

```typescript
function calculateGoalUpdateXP(previousProgress: number, newProgress: number): number {
  const improvement = newProgress - previousProgress;

  if (improvement >= 50) return 100; // +50% ou mais
  if (improvement >= 25) return 50; // +25% a +49%
  if (improvement >= 10) return 25; // +10% a +24%

  return 10; // Qualquer progresso positivo
}

// Bônus ao completar meta:
if (newProgress === 100) {
  xp += 200; // Bônus de conclusão
}
```

---

## 📦 4. Competencies Module

### **Competency**

Habilidade que o usuário está desenvolvendo.

```prisma
model Competency {
  id              String            @id @default(uuid()) @db.Uuid
  cycleId         String            @map("cycle_id") @db.Uuid
  userId          String            @map("user_id") @db.Uuid
  name            String
  category        CompetencyCategory
  currentLevel    Int               @default(1) @map("current_level")
  targetLevel     Int               @map("target_level")
  currentProgress Int               @default(0) @map("current_progress") // 0-100
  totalXP         Int               @default(0) @map("total_xp")
}
```

**CompetencyCategory (Enum):**

```prisma
enum CompetencyCategory {
  TECHNICAL   // Ex: React, Node.js, AWS
  LEADERSHIP  // Ex: Liderança de Times, Gestão de Projetos
  BEHAVIORAL  // Ex: Comunicação, Empatia
}
```

**Sistema de Níveis:**

```typescript
// Níveis: 1 (Iniciante) → 5 (Expert)

// Quando currentProgress atinge 100%:
currentLevel += 1;
currentProgress = 0;
totalXP += currentLevel * 100; // Level 2→3 = 200 XP

// Exemplo:
// Nível 2, Progresso 60% → Atualizar para 100%
// Resultado: Nível 3, Progresso 0%, +200 XP
```

**Milestones por Nível:**

- Nível 1: Iniciante (aprendendo conceitos básicos)
- Nível 2: Básico (aplica com supervisão)
- Nível 3: Intermediário (aplica independentemente)
- Nível 4: Avançado (domina e ensina outros)
- Nível 5: Expert (referência na área)

---

### **CompetencyUpdate**

Histórico de progresso em competências.

```prisma
model CompetencyUpdate {
  id                String      @id @default(uuid()) @db.Uuid
  competencyId      String      @map("competency_id") @db.Uuid
  previousProgress  Int         @map("previous_progress")
  newProgress       Int         @map("new_progress")
  notes             String?     @db.Text
  evidenceUrl       String?     @map("evidence_url") // Link para certificado, PR, etc
  xpEarned          Int         @default(0) @map("xp_earned")
}
```

---

## 📦 5. Activities Module

### **Activity**

Evento na timeline do usuário (1:1, mentoria, certificação, etc).

```prisma
model Activity {
  id           String       @id @default(uuid()) @db.Uuid
  cycleId      String       @map("cycle_id") @db.Uuid
  userId       String       @map("user_id") @db.Uuid
  type         ActivityType
  title        String
  description  String?      @db.Text
  xpEarned     Int          @default(0) @map("xp_earned")
  duration     Int?         // Minutos
  createdAt    DateTime     @default(now()) @map("created_at")
}
```

**ActivityType (Enum):**

```prisma
enum ActivityType {
  ONE_ON_ONE          // Reunião 1:1
  MENTORING           // Sessão de mentoria
  CERTIFICATION       // Certificação/Curso
  GOAL_UPDATE         // Atualização de meta
  COMPETENCY_UPDATE   // Atualização de competência
}
```

**XP Base por Tipo:**

```typescript
const BASE_XP = {
  ONE_ON_ONE: 50, // 45 min → 50 XP
  MENTORING: 35, // 60 min → 35 XP
  CERTIFICATION: 100, // Fixo
  GOAL_UPDATE: 25, // Variável (ver GoalUpdate)
  COMPETENCY_UPDATE: 40, // Variável (ver CompetencyUpdate)
};

// Ajuste por duração (para 1:1 e Mentoring):
const finalXP = BASE_XP[type] * (duration / 60);
```

---

### **OneOnOneActivity**

Detalhes específicos de reunião 1:1.

```prisma
model OneOnOneActivity {
  id                String   @id @default(uuid()) @db.Uuid
  activityId        String   @unique @map("activity_id") @db.Uuid
  participantName   String   @map("participant_name")
  workingOn         Json     // Array: ["Refatoração", "Testes E2E"]
  generalNotes      String   @map("general_notes") @db.Text
  positivePoints    Json     // Array: ["Proatividade", "Comunicação"]
  improvementPoints Json     // Array: ["Confiança", "Documentação"]
  nextSteps         Json     // Array: ["Estudar Design Patterns"]
}
```

**Exemplo de dados:**

```json
{
  "workingOn": ["Refatoração do módulo de autenticação", "Implementação de testes E2E"],
  "positivePoints": ["Excelente proatividade", "Ótima comunicação com o time"],
  "improvementPoints": [
    "Trabalhar na confiança para tomar decisões",
    "Documentar melhor as decisões técnicas"
  ],
  "nextSteps": ["Estudar padrões de design avançados", "Liderar próximo refinamento"]
}
```

---

### **MentoringActivity**

Detalhes específicos de sessão de mentoria.

```prisma
model MentoringActivity {
  id               String   @id @default(uuid()) @db.Uuid
  activityId       String   @unique @map("activity_id") @db.Uuid
  menteeName       String   @map("mentee_name")
  topics           Json     // Array: ["Clean Code", "SOLID"]
  progressFrom     Int?     @map("progress_from") // 60%
  progressTo       Int?     @map("progress_to")   // 75%
  outcomes         String?  @db.Text
  nextSteps        Json     // Array: ["Aplicar DIP", "Estudar OCP"]
}
```

---

### **CertificationActivity**

Detalhes específicos de certificação/curso.

```prisma
model CertificationActivity {
  id                String   @id @default(uuid()) @db.Uuid
  activityId        String   @unique @map("activity_id") @db.Uuid
  certificationName String   @map("certification_name")
  topics            Json     // Array: ["EC2", "S3", "Lambda"]
  outcomes          String?  @db.Text
  rating            Int?     // 1-5: Dificuldade/Qualidade
  nextSteps         Json     // Array: ["Aplicar no projeto", "Estudar Pro"]
}
```

---

## 🔗 Relacionamentos Completos

### **User**

```
User 1:1 GamificationProfile
User 1:N Goals
User 1:N Competencies
User 1:N Activities
```

### **Workspace**

```
Workspace 1:N Cycles
```

### **Cycle**

```
Cycle 1:N Goals
Cycle 1:N Competencies
Cycle 1:N Activities
```

### **Goal**

```
Goal 1:N GoalUpdates
```

### **Competency**

```
Competency 1:N CompetencyUpdates
```

### **Activity (Polimórfico)**

```
Activity 1:1 OneOnOneActivity (opcional)
Activity 1:1 MentoringActivity (opcional)
Activity 1:1 CertificationActivity (opcional)
```

---

## 📊 Indexes para Performance

**Indexes Criados:**

```prisma
// GamificationProfile
@@index([userId])
@@index([level])

// Cycle
@@index([workspaceId])
@@index([status])
@@index([startDate])
@@index([endDate])

// Goal
@@index([cycleId])
@@index([userId])
@@index([status])
@@index([type])

// Competency
@@index([cycleId])
@@index([userId])
@@index([category])

// Activity
@@index([cycleId])
@@index([userId])
@@index([type])
@@index([createdAt])
```

**Queries Otimizadas:**

- `WHERE status = 'ACTIVE'` → Index em `status`
- `WHERE userId = '...'` → Index em `userId`
- `ORDER BY createdAt DESC` → Index em `createdAt`

---

## 🧪 Dados de Teste (Seed)

### **Estrutura do Seed:**

```typescript
// 1. Criar workspace de teste
const workspace = await prisma.workspace.create({...});

// 2. Criar 3 usuários
const users = await Promise.all([
  prisma.user.create({ email: 'joao@forji.com', ... }),
  prisma.user.create({ email: 'maria@forji.com', ... }),
  prisma.user.create({ email: 'pedro@forji.com', ... }),
]);

// 3. Criar gamification profiles
await Promise.all(users.map(user =>
  prisma.gamificationProfile.create({
    userId: user.id,
    level: Math.floor(Math.random() * 10) + 1,
    totalXP: Math.floor(Math.random() * 5000),
    streak: Math.floor(Math.random() * 30),
  })
));

// 4. Criar ciclo ativo
const cycle = await prisma.cycle.create({
  workspaceId: workspace.id,
  name: 'Q4 2024 - Excelência Técnica',
  startDate: new Date('2024-10-01'),
  endDate: new Date('2024-12-31'),
  status: 'ACTIVE',
});

// 5. Criar 12 goals variados
// 6. Criar 9 competencies
// 7. Criar 20 activities
```

---

## 🚀 Próximos Passos

### **Fase 1 - Completa:**

- ✅ Schema Prisma definido
- ⏭️ Criar migration
- ⏭️ Criar seed script
- ⏭️ Validar com Prisma Studio

### **Fase 2 - Backend Modules:**

- ⏭️ Gamification Module
- ⏭️ Cycles Module
- ⏭️ Goals Module
- ⏭️ Competencies Module
- ⏭️ Activities Module

---

## 📚 Referências

- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Mock Data Original](../frontend/src/pages/mockData.ts)
- [CurrentCyclePage Component](../frontend/src/pages/CurrentCyclePageOptimized.tsx)

---

**Última atualização:** 19 de outubro de 2025  
**Versão do Schema:** 1.0.0
