/*
  Warnings:

  - The `state` column on the `pull_requests` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."PrState" AS ENUM ('open', 'closed', 'merged');

-- AlterTable
ALTER TABLE "public"."pull_requests" DROP COLUMN "state",
ADD COLUMN     "state" "public"."PrState";

-- CreateIndex
CREATE INDEX "pull_req_state_idx" ON "public"."pull_requests"("state");
