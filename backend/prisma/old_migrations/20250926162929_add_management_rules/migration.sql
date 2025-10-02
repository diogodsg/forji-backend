/*
  Warnings:

  - Changed the type of `ruleType` on the `ManagementRule` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."ManagementRuleType" AS ENUM ('TEAM', 'INDIVIDUAL');

-- AlterTable
ALTER TABLE "public"."ManagementRule" DROP COLUMN "ruleType",
ADD COLUMN     "ruleType" "public"."ManagementRuleType" NOT NULL;
