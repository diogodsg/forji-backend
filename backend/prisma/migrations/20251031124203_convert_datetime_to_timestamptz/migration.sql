-- Convert all DateTime columns to TIMESTAMPTZ (timestamp with timezone)
-- This migration converts all timestamp columns from TIMESTAMP to TIMESTAMPTZ
-- Using America/Sao_Paulo timezone (UTC-3 / Brasília)

-- Workspaces
ALTER TABLE "workspaces" 
  ALTER COLUMN "created_at" TYPE TIMESTAMPTZ USING "created_at" AT TIME ZONE 'America/Sao_Paulo',
  ALTER COLUMN "updated_at" TYPE TIMESTAMPTZ USING "updated_at" AT TIME ZONE 'America/Sao_Paulo',
  ALTER COLUMN "deleted_at" TYPE TIMESTAMPTZ USING "deleted_at" AT TIME ZONE 'America/Sao_Paulo';

-- Workspace Members
ALTER TABLE "workspace_members" 
  ALTER COLUMN "joined_at" TYPE TIMESTAMPTZ USING "joined_at" AT TIME ZONE 'America/Sao_Paulo',
  ALTER COLUMN "deleted_at" TYPE TIMESTAMPTZ USING "deleted_at" AT TIME ZONE 'America/Sao_Paulo';

-- Users
ALTER TABLE "users" 
  ALTER COLUMN "created_at" TYPE TIMESTAMPTZ USING "created_at" AT TIME ZONE 'America/Sao_Paulo',
  ALTER COLUMN "updated_at" TYPE TIMESTAMPTZ USING "updated_at" AT TIME ZONE 'America/Sao_Paulo',
  ALTER COLUMN "deleted_at" TYPE TIMESTAMPTZ USING "deleted_at" AT TIME ZONE 'America/Sao_Paulo';

-- Teams
ALTER TABLE "teams" 
  ALTER COLUMN "created_at" TYPE TIMESTAMPTZ USING "created_at" AT TIME ZONE 'America/Sao_Paulo',
  ALTER COLUMN "updated_at" TYPE TIMESTAMPTZ USING "updated_at" AT TIME ZONE 'America/Sao_Paulo',
  ALTER COLUMN "deleted_at" TYPE TIMESTAMPTZ USING "deleted_at" AT TIME ZONE 'America/Sao_Paulo';

-- Team Members
ALTER TABLE "team_members" 
  ALTER COLUMN "joined_at" TYPE TIMESTAMPTZ USING "joined_at" AT TIME ZONE 'America/Sao_Paulo',
  ALTER COLUMN "deleted_at" TYPE TIMESTAMPTZ USING "deleted_at" AT TIME ZONE 'America/Sao_Paulo';

-- Management Rules
ALTER TABLE "management_rules" 
  ALTER COLUMN "created_at" TYPE TIMESTAMPTZ USING "created_at" AT TIME ZONE 'America/Sao_Paulo',
  ALTER COLUMN "updated_at" TYPE TIMESTAMPTZ USING "updated_at" AT TIME ZONE 'America/Sao_Paulo',
  ALTER COLUMN "deleted_at" TYPE TIMESTAMPTZ USING "deleted_at" AT TIME ZONE 'America/Sao_Paulo';

-- Gamification Profiles
ALTER TABLE "gamification_profiles" 
  ALTER COLUMN "last_active_at" TYPE TIMESTAMPTZ USING "last_active_at" AT TIME ZONE 'America/Sao_Paulo',
  ALTER COLUMN "created_at" TYPE TIMESTAMPTZ USING "created_at" AT TIME ZONE 'America/Sao_Paulo',
  ALTER COLUMN "updated_at" TYPE TIMESTAMPTZ USING "updated_at" AT TIME ZONE 'America/Sao_Paulo';

-- Badges
ALTER TABLE "badges" 
  ALTER COLUMN "earned_at" TYPE TIMESTAMPTZ USING "earned_at" AT TIME ZONE 'America/Sao_Paulo';

-- XP Transactions
ALTER TABLE "xp_transactions" 
  ALTER COLUMN "created_at" TYPE TIMESTAMPTZ USING "created_at" AT TIME ZONE 'America/Sao_Paulo';

-- Cycles
ALTER TABLE "cycles" 
  ALTER COLUMN "start_date" TYPE TIMESTAMPTZ USING "start_date" AT TIME ZONE 'America/Sao_Paulo',
  ALTER COLUMN "end_date" TYPE TIMESTAMPTZ USING "end_date" AT TIME ZONE 'America/Sao_Paulo',
  ALTER COLUMN "created_at" TYPE TIMESTAMPTZ USING "created_at" AT TIME ZONE 'America/Sao_Paulo',
  ALTER COLUMN "updated_at" TYPE TIMESTAMPTZ USING "updated_at" AT TIME ZONE 'America/Sao_Paulo',
  ALTER COLUMN "deleted_at" TYPE TIMESTAMPTZ USING "deleted_at" AT TIME ZONE 'America/Sao_Paulo';

-- Goals
ALTER TABLE "goals" 
  ALTER COLUMN "last_update_at" TYPE TIMESTAMPTZ USING "last_update_at" AT TIME ZONE 'America/Sao_Paulo',
  ALTER COLUMN "created_at" TYPE TIMESTAMPTZ USING "created_at" AT TIME ZONE 'America/Sao_Paulo',
  ALTER COLUMN "updated_at" TYPE TIMESTAMPTZ USING "updated_at" AT TIME ZONE 'America/Sao_Paulo',
  ALTER COLUMN "deleted_at" TYPE TIMESTAMPTZ USING "deleted_at" AT TIME ZONE 'America/Sao_Paulo';

-- Goal Updates
ALTER TABLE "goal_updates" 
  ALTER COLUMN "created_at" TYPE TIMESTAMPTZ USING "created_at" AT TIME ZONE 'America/Sao_Paulo';

-- Competencies
ALTER TABLE "competencies" 
  ALTER COLUMN "created_at" TYPE TIMESTAMPTZ USING "created_at" AT TIME ZONE 'America/Sao_Paulo',
  ALTER COLUMN "updated_at" TYPE TIMESTAMPTZ USING "updated_at" AT TIME ZONE 'America/Sao_Paulo',
  ALTER COLUMN "deleted_at" TYPE TIMESTAMPTZ USING "deleted_at" AT TIME ZONE 'America/Sao_Paulo';

-- Competency Updates
ALTER TABLE "competency_updates" 
  ALTER COLUMN "created_at" TYPE TIMESTAMPTZ USING "created_at" AT TIME ZONE 'America/Sao_Paulo';

-- Activities
ALTER TABLE "activities" 
  ALTER COLUMN "created_at" TYPE TIMESTAMPTZ USING "created_at" AT TIME ZONE 'America/Sao_Paulo',
  ALTER COLUMN "deleted_at" TYPE TIMESTAMPTZ USING "deleted_at" AT TIME ZONE 'America/Sao_Paulo';

-- One on One Activities
ALTER TABLE "one_on_one_activities" 
  ALTER COLUMN "completed_at" TYPE TIMESTAMPTZ USING "completed_at" AT TIME ZONE 'America/Sao_Paulo';

-- Notification Preferences
ALTER TABLE "notification_preferences" 
  ALTER COLUMN "created_at" TYPE TIMESTAMPTZ USING "created_at" AT TIME ZONE 'America/Sao_Paulo',
  ALTER COLUMN "updated_at" TYPE TIMESTAMPTZ USING "updated_at" AT TIME ZONE 'America/Sao_Paulo';

-- Email Logs
ALTER TABLE "email_logs" 
  ALTER COLUMN "sent_at" TYPE TIMESTAMPTZ USING "sent_at" AT TIME ZONE 'America/Sao_Paulo',
  ALTER COLUMN "created_at" TYPE TIMESTAMPTZ USING "created_at" AT TIME ZONE 'America/Sao_Paulo';
