-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."PrState" AS ENUM ('open', 'closed', 'merged');

-- CreateEnum
CREATE TYPE "public"."TeamRole" AS ENUM ('MEMBER', 'MANAGER');

-- CreateEnum
CREATE TYPE "public"."ManagementRuleType" AS ENUM ('TEAM', 'INDIVIDUAL');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" BIGSERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "github_id" TEXT,
    "bio" TEXT,
    "position" TEXT,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pull_requests" (
    "id" BIGINT NOT NULL,
    "number" BIGINT,
    "node_id" TEXT,
    "user" TEXT,
    "title" TEXT,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),
    "closed_at" TIMESTAMP(3),
    "merged_at" TIMESTAMP(3),
    "body" TEXT,
    "repo" TEXT,
    "last_reviewed_at" TIMESTAMP(3),
    "review_text" TEXT,
    "total_additions" BIGINT,
    "total_deletions" BIGINT,
    "total_changes" BIGINT,
    "ownerUserId" BIGINT,
    "state" "public"."PrState",
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "pull_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PdiPlan" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "competencies" TEXT[],
    "milestones" JSONB NOT NULL,
    "krs" JSONB,
    "records" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "PdiPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."file_changes" (
    "sha" TEXT NOT NULL,
    "filename" TEXT,
    "status" TEXT,
    "additions" BIGINT,
    "deletions" BIGINT,
    "changes" BIGINT,
    "patch" TEXT,
    "pr_id" BIGINT,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "file_changes_pkey" PRIMARY KEY ("sha")
);

-- CreateTable
CREATE TABLE "public"."Team" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TeamMembership" (
    "id" BIGSERIAL NOT NULL,
    "teamId" BIGINT NOT NULL,
    "userId" BIGINT NOT NULL,
    "role" "public"."TeamRole" NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "TeamMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ManagementRule" (
    "id" BIGSERIAL NOT NULL,
    "managerId" BIGINT NOT NULL,
    "teamId" BIGINT,
    "subordinateId" BIGINT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ruleType" "public"."ManagementRuleType" NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "ManagementRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_UserManagers" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL,

    CONSTRAINT "_UserManagers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_github_id_key" ON "public"."User"("github_id");

-- CreateIndex
CREATE INDEX "pull_req_owner_user_id_idx" ON "public"."pull_requests"("ownerUserId");

-- CreateIndex
CREATE INDEX "pull_req_repo_idx" ON "public"."pull_requests"("repo");

-- CreateIndex
CREATE INDEX "pull_req_state_idx" ON "public"."pull_requests"("state");

-- CreateIndex
CREATE INDEX "pull_req_user_idx" ON "public"."pull_requests"("user");

-- CreateIndex
CREATE INDEX "pull_req_title_idx" ON "public"."pull_requests"("title");

-- CreateIndex
CREATE UNIQUE INDEX "PdiPlan_userId_key" ON "public"."PdiPlan"("userId");

-- CreateIndex
CREATE INDEX "file_changes_pr_id_idx" ON "public"."file_changes"("pr_id");

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "public"."Team"("name");

-- CreateIndex
CREATE INDEX "TeamMembership_userId_idx" ON "public"."TeamMembership"("userId");

-- CreateIndex
CREATE INDEX "TeamMembership_teamId_role_idx" ON "public"."TeamMembership"("teamId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMembership_teamId_userId_key" ON "public"."TeamMembership"("teamId", "userId");

-- CreateIndex
CREATE INDEX "ManagementRule_managerId_idx" ON "public"."ManagementRule"("managerId");

-- CreateIndex
CREATE INDEX "ManagementRule_teamId_idx" ON "public"."ManagementRule"("teamId");

-- CreateIndex
CREATE INDEX "ManagementRule_subordinateId_idx" ON "public"."ManagementRule"("subordinateId");

-- CreateIndex
CREATE UNIQUE INDEX "ManagementRule_managerId_teamId_key" ON "public"."ManagementRule"("managerId", "teamId");

-- CreateIndex
CREATE UNIQUE INDEX "ManagementRule_managerId_subordinateId_key" ON "public"."ManagementRule"("managerId", "subordinateId");

-- CreateIndex
CREATE INDEX "_UserManagers_B_index" ON "public"."_UserManagers"("B");

-- AddForeignKey
ALTER TABLE "public"."pull_requests" ADD CONSTRAINT "pull_requests_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PdiPlan" ADD CONSTRAINT "PdiPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."file_changes" ADD CONSTRAINT "file_changes_pr_id_fkey" FOREIGN KEY ("pr_id") REFERENCES "public"."pull_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TeamMembership" ADD CONSTRAINT "TeamMembership_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TeamMembership" ADD CONSTRAINT "TeamMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ManagementRule" ADD CONSTRAINT "ManagementRule_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ManagementRule" ADD CONSTRAINT "ManagementRule_subordinateId_fkey" FOREIGN KEY ("subordinateId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ManagementRule" ADD CONSTRAINT "ManagementRule_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_UserManagers" ADD CONSTRAINT "_UserManagers_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_UserManagers" ADD CONSTRAINT "_UserManagers_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

