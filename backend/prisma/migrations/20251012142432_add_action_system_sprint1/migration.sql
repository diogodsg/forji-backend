/*
  Warnings:

  - You are about to drop the column `currentStreak` on the `GamificationProfile` table. All the data in the column will be lost.
  - You are about to drop the column `longestStreak` on the `GamificationProfile` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."ActionSubmissionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'REQUIRES_EVIDENCE');

-- DropIndex
DROP INDEX "public"."GamificationProfile_currentStreak_idx";

-- AlterTable
ALTER TABLE "public"."GamificationProfile" DROP COLUMN "currentStreak",
DROP COLUMN "longestStreak";

-- CreateTable
CREATE TABLE "public"."ActionSubmission" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "action" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "evidence" TEXT,
    "rating" DOUBLE PRECISION,
    "validatedBy" BIGINT,
    "status" "public"."ActionSubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "metadata" JSONB,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActionSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ActionCooldown" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "action" TEXT NOT NULL,
    "lastSubmission" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActionCooldown_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WeeklyCap" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "action" TEXT NOT NULL,
    "weekStart" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "maxCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyCap_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ActionSubmission_userId_idx" ON "public"."ActionSubmission"("userId");

-- CreateIndex
CREATE INDEX "ActionSubmission_action_idx" ON "public"."ActionSubmission"("action");

-- CreateIndex
CREATE INDEX "ActionSubmission_status_idx" ON "public"."ActionSubmission"("status");

-- CreateIndex
CREATE INDEX "ActionSubmission_createdAt_idx" ON "public"."ActionSubmission"("createdAt");

-- CreateIndex
CREATE INDEX "ActionSubmission_validatedBy_idx" ON "public"."ActionSubmission"("validatedBy");

-- CreateIndex
CREATE INDEX "ActionCooldown_userId_idx" ON "public"."ActionCooldown"("userId");

-- CreateIndex
CREATE INDEX "ActionCooldown_action_idx" ON "public"."ActionCooldown"("action");

-- CreateIndex
CREATE INDEX "ActionCooldown_expiresAt_idx" ON "public"."ActionCooldown"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "ActionCooldown_userId_action_key" ON "public"."ActionCooldown"("userId", "action");

-- CreateIndex
CREATE INDEX "WeeklyCap_userId_idx" ON "public"."WeeklyCap"("userId");

-- CreateIndex
CREATE INDEX "WeeklyCap_action_idx" ON "public"."WeeklyCap"("action");

-- CreateIndex
CREATE INDEX "WeeklyCap_weekStart_idx" ON "public"."WeeklyCap"("weekStart");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyCap_userId_action_weekStart_key" ON "public"."WeeklyCap"("userId", "action", "weekStart");

-- AddForeignKey
ALTER TABLE "public"."ActionSubmission" ADD CONSTRAINT "ActionSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ActionSubmission" ADD CONSTRAINT "ActionSubmission_validatedBy_fkey" FOREIGN KEY ("validatedBy") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ActionCooldown" ADD CONSTRAINT "ActionCooldown_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WeeklyCap" ADD CONSTRAINT "WeeklyCap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
