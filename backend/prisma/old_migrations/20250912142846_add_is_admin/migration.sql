-- DropIndex
DROP INDEX IF EXISTS "public"."_UserManagers_A_index";

-- DropIndex
DROP INDEX IF EXISTS "public"."pull_requests_ownerUserId_idx";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."_UserManagers" ADD CONSTRAINT "_UserManagers_AB_pkey" PRIMARY KEY ("A", "B");

-- Drop unique constraint instead of index to avoid dependency error
ALTER TABLE "public"."_UserManagers" DROP CONSTRAINT IF EXISTS "_UserManagers_AB_unique";
