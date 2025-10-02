/*
  Warnings:

  - A unique constraint covering the columns `[managerId,subordinateId,ruleType]` on the table `ManagementRule` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[managerId,teamId,ruleType]` on the table `ManagementRule` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."PdiCycleStatus" AS ENUM ('PLANNED', 'ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED');

-- DropIndex
DROP INDEX "public"."ManagementRule_managerId_subordinateId_key";

-- DropIndex
DROP INDEX "public"."ManagementRule_managerId_teamId_key";

-- CreateTable
CREATE TABLE "public"."PdiCycle" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "public"."PdiCycleStatus" NOT NULL DEFAULT 'PLANNED',
    "competencies" TEXT[],
    "krs" JSONB,
    "milestones" JSONB NOT NULL,
    "records" JSONB NOT NULL,
    "progressMeta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "PdiCycle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PdiCycle_userId_status_idx" ON "public"."PdiCycle"("userId", "status");

-- CreateIndex
CREATE INDEX "PdiCycle_startDate_idx" ON "public"."PdiCycle"("startDate");

-- CreateIndex
CREATE INDEX "PdiCycle_endDate_idx" ON "public"."PdiCycle"("endDate");

-- CreateIndex
CREATE INDEX "ManagementRule_ruleType_idx" ON "public"."ManagementRule"("ruleType");

-- CreateIndex
CREATE UNIQUE INDEX "ManagementRule_managerId_subordinateId_ruleType_key" ON "public"."ManagementRule"("managerId", "subordinateId", "ruleType");

-- CreateIndex
CREATE UNIQUE INDEX "ManagementRule_managerId_teamId_ruleType_key" ON "public"."ManagementRule"("managerId", "teamId", "ruleType");

-- CreateIndex
CREATE INDEX "pull_requests_created_at_idx" ON "public"."pull_requests"("created_at");

-- CreateIndex
CREATE INDEX "pull_requests_merged_at_idx" ON "public"."pull_requests"("merged_at");

-- AddForeignKey
ALTER TABLE "public"."PdiCycle" ADD CONSTRAINT "PdiCycle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
