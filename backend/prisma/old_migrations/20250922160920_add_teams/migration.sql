-- CreateEnum
CREATE TYPE "public"."TeamRole" AS ENUM ('MEMBER', 'MANAGER');

-- CreateTable
CREATE TABLE "public"."Team" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TeamMembership" (
    "id" BIGSERIAL NOT NULL,
    "teamId" BIGINT NOT NULL,
    "userId" BIGINT NOT NULL,
    "role" "public"."TeamRole" NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamMembership_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "public"."Team"("name");

-- CreateIndex
CREATE INDEX "TeamMembership_userId_idx" ON "public"."TeamMembership"("userId");

-- CreateIndex
CREATE INDEX "TeamMembership_teamId_role_idx" ON "public"."TeamMembership"("teamId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMembership_teamId_userId_key" ON "public"."TeamMembership"("teamId", "userId");

-- AddForeignKey
ALTER TABLE "public"."TeamMembership" ADD CONSTRAINT "TeamMembership_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TeamMembership" ADD CONSTRAINT "TeamMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
