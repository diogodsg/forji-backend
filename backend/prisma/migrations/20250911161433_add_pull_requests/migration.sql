-- CreateTable
CREATE TABLE "public"."pull_requests" (
    "id" INTEGER NOT NULL,
    "number" INTEGER,
    "node_id" TEXT,
    "user" TEXT,
    "title" TEXT,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),
    "closed_at" TIMESTAMP(3),
    "merged_at" TIMESTAMP(3),
    "body" TEXT,
    "repo" TEXT,
    "state" TEXT,
    "last_reviewed_at" TIMESTAMP(3),
    "review_text" TEXT,
    "total_additions" INTEGER,
    "total_deletions" INTEGER,
    "total_changes" INTEGER,

    CONSTRAINT "pull_requests_pkey" PRIMARY KEY ("id")
);
