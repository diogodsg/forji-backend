/*
  Warnings:

  - The primary key for the `PdiPlan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_UserManagers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `pull_requests` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."PdiPlan" DROP CONSTRAINT "PdiPlan_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_UserManagers" DROP CONSTRAINT "_UserManagers_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_UserManagers" DROP CONSTRAINT "_UserManagers_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."file_changes" DROP CONSTRAINT "file_changes_pr_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."pull_requests" DROP CONSTRAINT "pull_requests_ownerUserId_fkey";

-- AlterTable
ALTER TABLE "public"."PdiPlan" DROP CONSTRAINT "PdiPlan_pkey",
ALTER COLUMN "id" SET DATA TYPE BIGINT,
ALTER COLUMN "userId" SET DATA TYPE BIGINT,
ADD CONSTRAINT "PdiPlan_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" SET DATA TYPE BIGINT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."_UserManagers" DROP CONSTRAINT "_UserManagers_AB_pkey",
ALTER COLUMN "A" SET DATA TYPE BIGINT,
ALTER COLUMN "B" SET DATA TYPE BIGINT,
ADD CONSTRAINT "_UserManagers_AB_pkey" PRIMARY KEY ("A", "B");

-- AlterTable
ALTER TABLE "public"."file_changes" ALTER COLUMN "pr_id" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "public"."pull_requests" DROP CONSTRAINT "pull_requests_pkey",
ALTER COLUMN "id" SET DATA TYPE BIGINT,
ALTER COLUMN "ownerUserId" SET DATA TYPE BIGINT,
ADD CONSTRAINT "pull_requests_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "public"."pull_requests" ADD CONSTRAINT "pull_requests_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PdiPlan" ADD CONSTRAINT "PdiPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."file_changes" ADD CONSTRAINT "file_changes_pr_id_fkey" FOREIGN KEY ("pr_id") REFERENCES "public"."pull_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_UserManagers" ADD CONSTRAINT "_UserManagers_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_UserManagers" ADD CONSTRAINT "_UserManagers_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
