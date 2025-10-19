-- CreateEnum
CREATE TYPE "BadgeType" AS ENUM ('STREAK_7', 'STREAK_30', 'STREAK_100', 'GOAL_MASTER', 'MENTOR', 'CERTIFIED', 'TEAM_PLAYER', 'FAST_LEARNER', 'CONSISTENT');

-- CreateEnum
CREATE TYPE "CycleStatus" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "GoalType" AS ENUM ('INCREASE', 'DECREASE', 'PERCENTAGE', 'BINARY');

-- CreateEnum
CREATE TYPE "GoalStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'BLOCKED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CompetencyCategory" AS ENUM ('TECHNICAL', 'LEADERSHIP', 'BEHAVIORAL');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('ONE_ON_ONE', 'MENTORING', 'CERTIFICATION', 'GOAL_UPDATE', 'COMPETENCY_UPDATE');

-- CreateTable
CREATE TABLE "gamification_profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "current_xp" INTEGER NOT NULL DEFAULT 0,
    "total_xp" INTEGER NOT NULL DEFAULT 0,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "last_active_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gamification_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "badges" (
    "id" UUID NOT NULL,
    "gamification_profile_id" UUID NOT NULL,
    "type" "BadgeType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "earned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cycles" (
    "id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "status" "CycleStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "cycles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goals" (
    "id" UUID NOT NULL,
    "cycle_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "GoalType" NOT NULL,
    "status" "GoalStatus" NOT NULL DEFAULT 'ACTIVE',
    "current_value" DOUBLE PRECISION,
    "target_value" DOUBLE PRECISION,
    "start_value" DOUBLE PRECISION,
    "unit" TEXT,
    "last_update_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goal_updates" (
    "id" UUID NOT NULL,
    "goal_id" UUID NOT NULL,
    "previous_value" DOUBLE PRECISION,
    "new_value" DOUBLE PRECISION,
    "notes" TEXT,
    "xp_earned" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "goal_updates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competencies" (
    "id" UUID NOT NULL,
    "cycle_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "category" "CompetencyCategory" NOT NULL,
    "current_level" INTEGER NOT NULL DEFAULT 1,
    "target_level" INTEGER NOT NULL,
    "current_progress" INTEGER NOT NULL DEFAULT 0,
    "total_xp" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "competencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competency_updates" (
    "id" UUID NOT NULL,
    "competency_id" UUID NOT NULL,
    "previous_progress" INTEGER NOT NULL,
    "new_progress" INTEGER NOT NULL,
    "notes" TEXT,
    "evidence_url" TEXT,
    "xp_earned" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "competency_updates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" UUID NOT NULL,
    "cycle_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" "ActivityType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "xp_earned" INTEGER NOT NULL DEFAULT 0,
    "duration" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "one_on_one_activities" (
    "id" UUID NOT NULL,
    "activity_id" UUID NOT NULL,
    "participant_name" TEXT NOT NULL,
    "workingOn" JSONB NOT NULL,
    "general_notes" TEXT NOT NULL,
    "positive_points" JSONB NOT NULL,
    "improvement_points" JSONB NOT NULL,
    "next_steps" JSONB NOT NULL,

    CONSTRAINT "one_on_one_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mentoring_activities" (
    "id" UUID NOT NULL,
    "activity_id" UUID NOT NULL,
    "mentee_name" TEXT NOT NULL,
    "topics" JSONB NOT NULL,
    "progress_from" INTEGER,
    "progress_to" INTEGER,
    "outcomes" TEXT,
    "next_steps" JSONB NOT NULL,

    CONSTRAINT "mentoring_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certification_activities" (
    "id" UUID NOT NULL,
    "activity_id" UUID NOT NULL,
    "certification_name" TEXT NOT NULL,
    "topics" JSONB NOT NULL,
    "outcomes" TEXT,
    "rating" INTEGER,
    "next_steps" JSONB NOT NULL,

    CONSTRAINT "certification_activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "gamification_profiles_user_id_key" ON "gamification_profiles"("user_id");

-- CreateIndex
CREATE INDEX "gamification_profiles_user_id_idx" ON "gamification_profiles"("user_id");

-- CreateIndex
CREATE INDEX "gamification_profiles_level_idx" ON "gamification_profiles"("level");

-- CreateIndex
CREATE INDEX "badges_gamification_profile_id_idx" ON "badges"("gamification_profile_id");

-- CreateIndex
CREATE INDEX "badges_type_idx" ON "badges"("type");

-- CreateIndex
CREATE INDEX "cycles_workspace_id_idx" ON "cycles"("workspace_id");

-- CreateIndex
CREATE INDEX "cycles_status_idx" ON "cycles"("status");

-- CreateIndex
CREATE INDEX "cycles_start_date_idx" ON "cycles"("start_date");

-- CreateIndex
CREATE INDEX "cycles_end_date_idx" ON "cycles"("end_date");

-- CreateIndex
CREATE INDEX "goals_cycle_id_idx" ON "goals"("cycle_id");

-- CreateIndex
CREATE INDEX "goals_user_id_idx" ON "goals"("user_id");

-- CreateIndex
CREATE INDEX "goals_status_idx" ON "goals"("status");

-- CreateIndex
CREATE INDEX "goals_type_idx" ON "goals"("type");

-- CreateIndex
CREATE INDEX "goal_updates_goal_id_idx" ON "goal_updates"("goal_id");

-- CreateIndex
CREATE INDEX "goal_updates_created_at_idx" ON "goal_updates"("created_at");

-- CreateIndex
CREATE INDEX "competencies_cycle_id_idx" ON "competencies"("cycle_id");

-- CreateIndex
CREATE INDEX "competencies_user_id_idx" ON "competencies"("user_id");

-- CreateIndex
CREATE INDEX "competencies_category_idx" ON "competencies"("category");

-- CreateIndex
CREATE INDEX "competency_updates_competency_id_idx" ON "competency_updates"("competency_id");

-- CreateIndex
CREATE INDEX "competency_updates_created_at_idx" ON "competency_updates"("created_at");

-- CreateIndex
CREATE INDEX "activities_cycle_id_idx" ON "activities"("cycle_id");

-- CreateIndex
CREATE INDEX "activities_user_id_idx" ON "activities"("user_id");

-- CreateIndex
CREATE INDEX "activities_type_idx" ON "activities"("type");

-- CreateIndex
CREATE INDEX "activities_created_at_idx" ON "activities"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "one_on_one_activities_activity_id_key" ON "one_on_one_activities"("activity_id");

-- CreateIndex
CREATE INDEX "one_on_one_activities_activity_id_idx" ON "one_on_one_activities"("activity_id");

-- CreateIndex
CREATE UNIQUE INDEX "mentoring_activities_activity_id_key" ON "mentoring_activities"("activity_id");

-- CreateIndex
CREATE INDEX "mentoring_activities_activity_id_idx" ON "mentoring_activities"("activity_id");

-- CreateIndex
CREATE UNIQUE INDEX "certification_activities_activity_id_key" ON "certification_activities"("activity_id");

-- CreateIndex
CREATE INDEX "certification_activities_activity_id_idx" ON "certification_activities"("activity_id");

-- AddForeignKey
ALTER TABLE "gamification_profiles" ADD CONSTRAINT "gamification_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "badges" ADD CONSTRAINT "badges_gamification_profile_id_fkey" FOREIGN KEY ("gamification_profile_id") REFERENCES "gamification_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cycles" ADD CONSTRAINT "cycles_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goal_updates" ADD CONSTRAINT "goal_updates_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competencies" ADD CONSTRAINT "competencies_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competencies" ADD CONSTRAINT "competencies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competency_updates" ADD CONSTRAINT "competency_updates_competency_id_fkey" FOREIGN KEY ("competency_id") REFERENCES "competencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "one_on_one_activities" ADD CONSTRAINT "one_on_one_activities_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentoring_activities" ADD CONSTRAINT "mentoring_activities_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certification_activities" ADD CONSTRAINT "certification_activities_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
