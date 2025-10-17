/*
  Warnings:

  - You are about to drop the column `is_admin` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `is_manager` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[workspace_id,manager_id,subordinate_id,rule_type]` on the table `management_rules` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[workspace_id,manager_id,team_id,rule_type]` on the table `management_rules` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[workspace_id,name]` on the table `teams` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `workspace_id` to the `management_rules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workspace_id` to the `teams` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WorkspaceStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "WorkspaceRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- DropIndex
DROP INDEX "management_rules_manager_id_subordinate_id_rule_type_key";

-- DropIndex
DROP INDEX "management_rules_manager_id_team_id_rule_type_key";

-- DropIndex
DROP INDEX "teams_name_key";

-- AlterTable
ALTER TABLE "management_rules" ADD COLUMN     "workspace_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "teams" ADD COLUMN     "workspace_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "is_admin",
DROP COLUMN "is_manager";

-- CreateTable
CREATE TABLE "workspaces" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "avatar_url" TEXT,
    "status" "WorkspaceStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "workspaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspace_members" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,
    "role" "WorkspaceRole" NOT NULL DEFAULT 'MEMBER',
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "workspace_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "workspaces_slug_key" ON "workspaces"("slug");

-- CreateIndex
CREATE INDEX "workspaces_slug_idx" ON "workspaces"("slug");

-- CreateIndex
CREATE INDEX "workspaces_status_idx" ON "workspaces"("status");

-- CreateIndex
CREATE INDEX "workspace_members_user_id_idx" ON "workspace_members"("user_id");

-- CreateIndex
CREATE INDEX "workspace_members_workspace_id_idx" ON "workspace_members"("workspace_id");

-- CreateIndex
CREATE INDEX "workspace_members_role_idx" ON "workspace_members"("role");

-- CreateIndex
CREATE UNIQUE INDEX "workspace_members_user_id_workspace_id_key" ON "workspace_members"("user_id", "workspace_id");

-- CreateIndex
CREATE INDEX "management_rules_workspace_id_idx" ON "management_rules"("workspace_id");

-- CreateIndex
CREATE UNIQUE INDEX "management_rules_workspace_id_manager_id_subordinate_id_rul_key" ON "management_rules"("workspace_id", "manager_id", "subordinate_id", "rule_type");

-- CreateIndex
CREATE UNIQUE INDEX "management_rules_workspace_id_manager_id_team_id_rule_type_key" ON "management_rules"("workspace_id", "manager_id", "team_id", "rule_type");

-- CreateIndex
CREATE INDEX "teams_workspace_id_idx" ON "teams"("workspace_id");

-- CreateIndex
CREATE UNIQUE INDEX "teams_workspace_id_name_key" ON "teams"("workspace_id", "name");

-- AddForeignKey
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "management_rules" ADD CONSTRAINT "management_rules_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
