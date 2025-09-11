-- Add optional ownerUserId to link PRs to a User for filtering
ALTER TABLE "public"."pull_requests" ADD COLUMN "ownerUserId" INTEGER;
ALTER TABLE "public"."pull_requests"
  ADD CONSTRAINT "pull_requests_ownerUserId_fkey"
  FOREIGN KEY ("ownerUserId") REFERENCES "public"."User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
CREATE INDEX "pull_requests_ownerUserId_idx" ON "public"."pull_requests"("ownerUserId");
