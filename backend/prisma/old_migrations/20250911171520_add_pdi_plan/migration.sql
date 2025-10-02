-- CreateTable
CREATE TABLE "public"."PdiPlan" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "competencies" TEXT[],
    "milestones" JSONB NOT NULL,
    "krs" JSONB,
    "records" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PdiPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PdiPlan_userId_key" ON "public"."PdiPlan"("userId");

-- AddForeignKey
ALTER TABLE "public"."PdiPlan" ADD CONSTRAINT "PdiPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
