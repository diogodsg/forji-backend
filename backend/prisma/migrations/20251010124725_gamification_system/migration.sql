-- CreateTable
CREATE TABLE "public"."GamificationProfile" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "totalXP" INTEGER NOT NULL DEFAULT 0,
    "weeklyXP" INTEGER NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastActivityDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GamificationProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserBadge" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "rarity" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "progress" INTEGER,
    "maxProgress" INTEGER,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserBadge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."XpHistory" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "action" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "XpHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GamificationProfile_userId_key" ON "public"."GamificationProfile"("userId");

-- CreateIndex
CREATE INDEX "GamificationProfile_totalXP_idx" ON "public"."GamificationProfile"("totalXP");

-- CreateIndex
CREATE INDEX "GamificationProfile_weeklyXP_idx" ON "public"."GamificationProfile"("weeklyXP");

-- CreateIndex
CREATE INDEX "GamificationProfile_currentStreak_idx" ON "public"."GamificationProfile"("currentStreak");

-- CreateIndex
CREATE INDEX "UserBadge_userId_idx" ON "public"."UserBadge"("userId");

-- CreateIndex
CREATE INDEX "UserBadge_badgeId_idx" ON "public"."UserBadge"("badgeId");

-- CreateIndex
CREATE INDEX "UserBadge_category_idx" ON "public"."UserBadge"("category");

-- CreateIndex
CREATE INDEX "UserBadge_rarity_idx" ON "public"."UserBadge"("rarity");

-- CreateIndex
CREATE UNIQUE INDEX "UserBadge_userId_badgeId_key" ON "public"."UserBadge"("userId", "badgeId");

-- CreateIndex
CREATE INDEX "XpHistory_userId_idx" ON "public"."XpHistory"("userId");

-- CreateIndex
CREATE INDEX "XpHistory_action_idx" ON "public"."XpHistory"("action");

-- CreateIndex
CREATE INDEX "XpHistory_category_idx" ON "public"."XpHistory"("category");

-- CreateIndex
CREATE INDEX "XpHistory_createdAt_idx" ON "public"."XpHistory"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."GamificationProfile" ADD CONSTRAINT "GamificationProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserBadge" ADD CONSTRAINT "UserBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."GamificationProfile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."XpHistory" ADD CONSTRAINT "XpHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."GamificationProfile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
