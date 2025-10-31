# Exemplo de Integração: Goals + Email

## Como integrar emails com GoalsService

### 1. Adicionar EmailModule no GoalsModule

```typescript
// goals/goals.module.ts
import { Module } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { GoalsController } from './goals.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { GamificationModule } from '../gamification/gamification.module';
import { EmailModule } from '../email/email.module'; // ← Adicionar

@Module({
  imports: [
    PrismaModule,
    GamificationModule,
    EmailModule, // ← Adicionar
  ],
  controllers: [GoalsController],
  providers: [GoalsService],
  exports: [GoalsService],
})
export class GoalsModule {}
```

### 2. Injetar EmailService no GoalsService

```typescript
// goals/goals.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GamificationService } from '../gamification/gamification.service';
import { EmailService } from '../email/email.service'; // ← Adicionar
import { EmailType } from '../email/interfaces/email.interface'; // ← Adicionar

@Injectable()
export class GoalsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gamificationService: GamificationService,
    private readonly emailService: EmailService, // ← Injetar
  ) {}

  // ... métodos existentes ...
}
```

### 3. Enviar email quando meta é criada

```typescript
async createGoal(dto: CreateGoalDto, userId: string, workspaceId: string) {
  // 1. Criar meta
  const goal = await this.prisma.goal.create({
    data: {
      ...dto,
      userId,
      workspaceId,
    },
  });

  // 2. Adicionar XP (+25)
  await this.gamificationService.addXP({
    userId,
    workspaceId,
    amount: 25,
    reason: 'Goal created',
  });

  // 3. Buscar usuário para email
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
  });

  // 4. Enviar email de confirmação
  await this.emailService.queueEmail({
    to: user.email,
    subject: '🎯 Meta criada com sucesso!',
    type: EmailType.GOAL_ASSIGNED,
    data: {
      userName: user.name,
      goalTitle: goal.title,
      goalDescription: goal.description,
      dueDate: goal.dueDate?.toISOString().split('T')[0],
      xpEarned: 25,
      workspaceUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    },
  }, 2); // Prioridade média

  return goal;
}
```

### 4. Criar template para GOAL_ASSIGNED (adicionar ao EmailService)

```typescript
// email/email.service.ts

private async getEmailTemplate(type: EmailType, data: any): Promise<string> {
  switch (type) {
    // ... outros cases ...

    case EmailType.GOAL_ASSIGNED:
      return this.getGoalAssignedTemplate(data);

    // ... resto do switch ...
  }
}

/**
 * Template: Meta Atribuída
 */
private getGoalAssignedTemplate(data: any): string {
  return \`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Meta Criada</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6; }
          .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .icon { font-size: 64px; margin: 20px 0; }
          .content { padding: 40px 30px; }
          .goal-title { font-size: 24px; font-weight: bold; color: #1f2937; margin: 20px 0; }
          .goal-description { color: #6b7280; line-height: 1.6; margin: 20px 0; }
          .info-box { background: #f9fafb; border-radius: 12px; padding: 20px; margin: 20px 0; }
          .info-row { display: flex; justify-content: space-between; margin: 10px 0; }
          .info-label { color: #6b7280; }
          .info-value { font-weight: bold; color: #1f2937; }
          .xp-badge { display: inline-block; background: #7c3aed; color: white; padding: 8px 16px; border-radius: 20px; font-weight: 600; margin: 20px 0; }
          .button { display: inline-block; background: #10b981; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 20px; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="icon">🎯</div>
            <h1>Nova Meta Criada!</h1>
          </div>
          <div class="content">
            <p style="font-size: 18px; color: #1f2937;">
              Parabéns, \${data.userName}! Sua meta foi criada com sucesso.
            </p>

            <div class="goal-title">\${data.goalTitle}</div>

            \${data.goalDescription ? \`<div class="goal-description">\${data.goalDescription}</div>\` : ''}

            <div class="info-box">
              \${data.dueDate ? \`
                <div class="info-row">
                  <span class="info-label">📅 Prazo</span>
                  <span class="info-value">\${data.dueDate}</span>
                </div>
              \` : ''}
              <div class="info-row">
                <span class="info-label">✨ XP Ganho</span>
                <span class="info-value">+\${data.xpEarned} XP</span>
              </div>
            </div>

            <p style="color: #6b7280; margin-top: 30px;">
              Continue assim! Cada meta te aproxima dos seus objetivos de desenvolvimento.
            </p>

            <div style="text-align: center;">
              <a href="\${data.workspaceUrl}/development" class="button">Ver Minhas Metas</a>
            </div>
          </div>
          <div class="footer">
            <p>Forji - Plataforma Gamificada para Desenvolvimento de Times</p>
            <p><a href="\${data.workspaceUrl}/settings/notifications" style="color: #7c3aed;">Gerenciar preferências de email</a></p>
          </div>
        </div>
      </body>
    </html>
  \`;
}
```

---

## Exemplo Completo: GoalsService Integrado

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GamificationService } from '../gamification/gamification.service';
import { EmailService } from '../email/email.service';
import { EmailType } from '../email/interfaces/email.interface';

@Injectable()
export class GoalsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gamificationService: GamificationService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Criar meta com notificação por email
   */
  async createGoal(dto: CreateGoalDto, userId: string, workspaceId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    const goal = await this.prisma.goal.create({
      data: {
        ...dto,
        userId,
        workspaceId,
      },
    });

    // Adicionar XP
    await this.gamificationService.addXP({
      userId,
      workspaceId,
      amount: 25,
      reason: 'Goal created',
    });

    // Enviar email
    await this.emailService.queueEmail({
      to: user.email,
      subject: '🎯 Meta criada com sucesso!',
      type: EmailType.GOAL_ASSIGNED,
      data: {
        userName: user.name,
        goalTitle: goal.title,
        goalDescription: goal.description,
        dueDate: goal.dueDate?.toISOString().split('T')[0],
        xpEarned: 25,
        workspaceUrl: process.env.FRONTEND_URL,
      },
    }, 2);

    return goal;
  }

  /**
   * Deletar meta com penalidade de XP e notificação
   */
  async deleteGoal(goalId: string, userId: string, workspaceId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const goal = await this.prisma.goal.findUnique({ where: { id: goalId } });

    await this.prisma.goal.delete({ where: { id: goalId } });

    // Remover XP
    await this.gamificationService.addXP({
      userId,
      workspaceId,
      amount: -25,
      reason: 'Goal deleted',
    });

    // Email de notificação (opcional)
    await this.emailService.queueEmail({
      to: user.email,
      subject: 'Meta removida',
      type: EmailType.GOAL_ASSIGNED, // Reutilizar template
      data: {
        userName: user.name,
        goalTitle: goal.title,
        goalDescription: 'Esta meta foi removida do seu PDI.',
        xpEarned: -25,
        workspaceUrl: process.env.FRONTEND_URL,
      },
    }, 5); // Baixa prioridade

    return { success: true };
  }

  /**
   * Cron job: Enviar lembretes de metas próximas do prazo
   * Executar diariamente às 9h
   */
  async sendGoalReminders() {
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    // Buscar metas que vencem em 7 dias
    const goals = await this.prisma.goal.findMany({
      where: {
        dueDate: {
          gte: new Date(),
          lte: sevenDaysFromNow,
        },
        status: {
          in: ['NOT_STARTED', 'IN_PROGRESS'],
        },
      },
      include: {
        user: true,
      },
    });

    for (const goal of goals) {
      const daysRemaining = Math.ceil(
        (goal.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );

      await this.emailService.queueEmail({
        to: goal.user.email,
        subject: \`⏰ Meta "\${goal.title}" vence em \${daysRemaining} dias\`,
        type: EmailType.GOAL_REMINDER,
        data: {
          userName: goal.user.name,
          goalTitle: goal.title,
          dueDate: goal.dueDate.toISOString().split('T')[0],
          daysRemaining,
          currentProgress: goal.progress || 0,
          workspaceUrl: process.env.FRONTEND_URL,
        },
      }, 3); // Prioridade média
    }

    return { sentReminders: goals.length };
  }
}
```

---

## Como Testar

### 1. Configurar .env

```bash
SENDGRID_API_KEY="SG.xxx"
SENDGRID_FROM_EMAIL="test@forji.com"
FRONTEND_URL="http://localhost:5173"
REDIS_HOST="localhost"
REDIS_PORT=6379
```

### 2. Iniciar Redis

```bash
redis-server
```

### 3. Criar uma meta via API

```bash
curl -X POST http://localhost:8000/goals \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Aprender React Hooks",
    "description": "Dominar useState, useEffect e hooks customizados",
    "dueDate": "2025-12-31",
    "priority": "HIGH"
  }'
```

### 4. Verificar fila do Bull

```bash
# Conectar no Redis
redis-cli

# Ver jobs na fila
KEYS bull:email:*
LLEN bull:email:wait
```

### 5. Monitorar logs

```bash
# Backend logs mostrarão:
[EmailService] Email queued: goal_assigned to user@example.com
[EmailProcessor] Processing email job 1: goal_assigned
[EmailService] Email sent successfully: goal_assigned to user@example.com
```

---

## Próximos Passos

1. ✅ Adicionar template `GOAL_ASSIGNED` ao `EmailService`
2. ✅ Integrar `EmailService` no `GoalsModule`
3. ✅ Adicionar envio de email em `createGoal()`
4. ⏳ Criar cron job para `sendGoalReminders()`
5. ⏳ Adicionar controller de preferências de notificação
6. ⏳ Dashboard de analytics de emails

---

**Com isso, o sistema de emails está totalmente integrado ao fluxo de Goals! 🚀**
