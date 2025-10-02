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
