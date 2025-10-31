-- AlterTable
ALTER TABLE "one_on_one_activities" ADD COLUMN     "completed_at" TIMESTAMP(3),
ADD COLUMN     "participant_id" UUID;

-- CreateIndex
CREATE INDEX "one_on_one_activities_participant_id_idx" ON "one_on_one_activities"("participant_id");

-- AddForeignKey
ALTER TABLE "one_on_one_activities" ADD CONSTRAINT "one_on_one_activities_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
