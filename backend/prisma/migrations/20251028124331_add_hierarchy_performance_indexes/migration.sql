-- CreateIndex
CREATE INDEX "idx_workspace_manager_deleted" ON "management_rules"("workspace_id", "manager_id", "deleted_at");

-- CreateIndex
CREATE INDEX "idx_workspace_subordinate_deleted" ON "management_rules"("workspace_id", "subordinate_id", "deleted_at");

-- CreateIndex
CREATE INDEX "idx_workspace_deleted_ruletype" ON "management_rules"("workspace_id", "deleted_at", "rule_type");
