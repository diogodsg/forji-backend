-- AlterTable
ALTER TABLE "public"."file_changes" ALTER COLUMN "additions" SET DATA TYPE BIGINT,
ALTER COLUMN "deletions" SET DATA TYPE BIGINT,
ALTER COLUMN "changes" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "public"."pull_requests" ALTER COLUMN "number" SET DATA TYPE BIGINT,
ALTER COLUMN "total_additions" SET DATA TYPE BIGINT,
ALTER COLUMN "total_deletions" SET DATA TYPE BIGINT,
ALTER COLUMN "total_changes" SET DATA TYPE BIGINT;
