/*
  Warnings:

  - A unique constraint covering the columns `[user_id,workspace_id]` on the table `gamification_profiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `workspace_id` to the `gamification_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "XpSource" AS ENUM ('ACTIVITY_ONE_ON_ONE', 'ACTIVITY_MENTORING', 'ACTIVITY_CERTIFICATION', 'GOAL_UPDATE', 'COMPETENCY_UPDATE', 'GOAL_COMPLETED', 'COMPETENCY_LEVEL_UP', 'STREAK_BONUS', 'MANUAL');

-- DropIndex
DROP INDEX "gamification_profiles_user_id_key";

-- AlterTable
ALTER TABLE "gamification_profiles" ADD COLUMN     "workspace_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "xp_transactions" (
    "id" UUID NOT NULL,
    "gamification_profile_id" UUID NOT NULL,
    "amount" INTEGER NOT NULL,
    "source" "XpSource" NOT NULL,
    "source_id" UUID,
    "reason" TEXT NOT NULL,
    "previous_xp" INTEGER NOT NULL,
    "new_xp" INTEGER NOT NULL,
    "previous_level" INTEGER NOT NULL,
    "new_level" INTEGER NOT NULL,
    "leveled_up" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "xp_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "xp_transactions_gamification_profile_id_idx" ON "xp_transactions"("gamification_profile_id");

-- CreateIndex
CREATE INDEX "xp_transactions_source_idx" ON "xp_transactions"("source");

-- CreateIndex
CREATE INDEX "xp_transactions_created_at_idx" ON "xp_transactions"("created_at");

-- CreateIndex
CREATE INDEX "gamification_profiles_workspace_id_idx" ON "gamification_profiles"("workspace_id");

-- CreateIndex
CREATE UNIQUE INDEX "gamification_profiles_user_id_workspace_id_key" ON "gamification_profiles"("user_id", "workspace_id");

-- AddForeignKey
ALTER TABLE "gamification_profiles" ADD CONSTRAINT "gamification_profiles_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xp_transactions" ADD CONSTRAINT "xp_transactions_gamification_profile_id_fkey" FOREIGN KEY ("gamification_profile_id") REFERENCES "gamification_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
