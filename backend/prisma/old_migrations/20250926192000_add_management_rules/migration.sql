-- CreateTable
CREATE TABLE "ManagementRule" (
    "id" BIGSERIAL NOT NULL,
    "managerId" BIGINT NOT NULL,
    "ruleType" TEXT NOT NULL,
    "teamId" BIGINT,
    "subordinateId" BIGINT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ManagementRule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ManagementRule_managerId_idx" ON "ManagementRule"("managerId");

-- CreateIndex
CREATE INDEX "ManagementRule_teamId_idx" ON "ManagementRule"("teamId");

-- CreateIndex
CREATE INDEX "ManagementRule_subordinateId_idx" ON "ManagementRule"("subordinateId");

-- CreateIndex
CREATE UNIQUE INDEX "ManagementRule_managerId_teamId_key" ON "ManagementRule"("managerId", "teamId");

-- CreateIndex
CREATE UNIQUE INDEX "ManagementRule_managerId_subordinateId_key" ON "ManagementRule"("managerId", "subordinateId");

-- AddForeignKey
ALTER TABLE "ManagementRule" ADD CONSTRAINT "ManagementRule_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManagementRule" ADD CONSTRAINT "ManagementRule_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManagementRule" ADD CONSTRAINT "ManagementRule_subordinateId_fkey" FOREIGN KEY ("subordinateId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;