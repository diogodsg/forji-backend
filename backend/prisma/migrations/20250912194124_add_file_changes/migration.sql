-- CreateTable
CREATE TABLE "public"."file_changes" (
    "sha" TEXT NOT NULL,
    "filename" TEXT,
    "status" TEXT,
    "additions" INTEGER,
    "deletions" INTEGER,
    "changes" INTEGER,
    "patch" TEXT,
    "pr_id" INTEGER,

    CONSTRAINT "file_changes_pkey" PRIMARY KEY ("sha")
);

-- CreateIndex
CREATE INDEX "file_changes_pr_id_idx" ON "public"."file_changes"("pr_id");

-- AddForeignKey
ALTER TABLE "public"."file_changes" ADD CONSTRAINT "file_changes_pr_id_fkey" FOREIGN KEY ("pr_id") REFERENCES "public"."pull_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;
