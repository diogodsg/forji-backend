-- Step 1: Add nullable workspace_id to existing tables
-- This allows existing data to remain valid during migration

-- Add workspace_id to teams (nullable first)
ALTER TABLE "teams" ADD COLUMN "workspace_id" UUID;

-- Add workspace_id to management_rules (nullable first)  
ALTER TABLE "management_rules" ADD COLUMN "workspace_id" UUID;

-- Remove old unique constraints from teams
ALTER TABLE "teams" DROP CONSTRAINT IF EXISTS "teams_name_key";

-- Remove old unique constraints from management_rules
ALTER TABLE "management_rules" DROP CONSTRAINT IF EXISTS "unique_manager_subordinate_rule";
ALTER TABLE "management_rules" DROP CONSTRAINT IF EXISTS "unique_manager_team_rule";

-- Create new tables
CREATE TABLE "workspaces" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "avatar_url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "workspaces_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "workspace_members" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "workspace_members_pkey" PRIMARY KEY ("id")
);

-- Create indexes
CREATE UNIQUE INDEX "workspaces_slug_key" ON "workspaces"("slug");
CREATE INDEX "workspaces_slug_idx" ON "workspaces"("slug");
CREATE INDEX "workspaces_status_idx" ON "workspaces"("status");

CREATE UNIQUE INDEX "unique_user_workspace" ON "workspace_members"("user_id", "workspace_id");
CREATE INDEX "workspace_members_user_id_idx" ON "workspace_members"("user_id");
CREATE INDEX "workspace_members_workspace_id_idx" ON "workspace_members"("workspace_id");
CREATE INDEX "workspace_members_role_idx" ON "workspace_members"("role");

-- Add foreign keys
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_user_id_fkey" 
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_workspace_id_fkey" 
    FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Note: workspace_id foreign keys for teams and management_rules will be added after data migration
