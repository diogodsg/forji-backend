#!/usr/bin/env node
/**
 * Migra cada registro de PdiPlan (se ainda não possuir ciclos) para um PdiCycle inicial ACTIVE.
 * Regras:
 *  - Se usuário já tem ciclo ACTIVE, pula.
 *  - Se usuário não tem nenhum ciclo, cria cycle ACTIVE usando dados do plano.
 *  - Datas: startDate = createdAt do plano ou now; endDate = updatedAt + 90 dias (heurística) se updatedAt > createdAt, senão startDate + 90d.
 *  - Status inicial ACTIVE.
 */
const { PrismaClient, PdiCycleStatus } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  const started = Date.now();
  console.log('[PDI MIGRATION] Iniciando migração de PdiPlan -> PdiCycle');
  const plans = await prisma.pdiPlan.findMany({ where: { deleted_at: null } });
  let created = 0;
  for (const plan of plans) {
    const existingActive = await prisma.pdiCycle.findFirst({
      where: { userId: plan.userId, status: PdiCycleStatus.ACTIVE, deleted_at: null },
    });
    if (existingActive) {
      console.log(`- user ${plan.userId}: já possui ciclo ACTIVE, pulando.`);
      continue;
    }
    const existingAny = await prisma.pdiCycle.findFirst({ where: { userId: plan.userId } });
    if (existingAny) {
      console.log(`- user ${plan.userId}: já possui ciclo(s), pulando.`);
      continue;
    }
    const startDate = plan.createdAt ? new Date(plan.createdAt) : new Date();
    const refEnd = plan.updatedAt && plan.updatedAt > plan.createdAt ? new Date(plan.updatedAt) : startDate;
    const endDate = new Date(refEnd.getTime() + 1000 * 60 * 60 * 24 * 90); // +90 dias

    await prisma.pdiCycle.create({
      data: {
        userId: plan.userId,
        title: `Ciclo Migrado ${startDate.toISOString().slice(0,10)}`,
        description: 'Gerado automaticamente a partir do PDI legado',
        startDate,
        endDate,
        status: PdiCycleStatus.ACTIVE,
        competencies: plan.competencies || [],
        krs: plan.krs,
        milestones: plan.milestones,
        records: plan.records,
      },
    });
    created++;
    console.log(`+ user ${plan.userId}: ciclo criado.`);
  }
  console.log(`[PDI MIGRATION] Concluído. ciclos criados=${created} em ${Date.now() - started}ms`);
  await prisma.$disconnect();
})().catch(async (e) => {
  console.error('[PDI MIGRATION] Erro', e);
  await prisma.$disconnect();
  process.exit(1);
});
