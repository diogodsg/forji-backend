/*
  Warnings:

  - Added the required column `user_id` to the `cycles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable: Adiciona coluna temporariamente como nullable
ALTER TABLE "cycles" ADD COLUMN "user_id" UUID;

-- Preenche com o primeiro usuário do workspace correspondente
UPDATE "forge"."cycles" c
SET "user_id" = (
  SELECT u.id 
  FROM "forge"."users" u
  INNER JOIN "forge"."workspace_members" wm ON wm.user_id = u.id
  WHERE wm.workspace_id = c.workspace_id 
    AND wm.deleted_at IS NULL
  LIMIT 1
);

-- Agora torna NOT NULL
ALTER TABLE "cycles" ALTER COLUMN "user_id" SET NOT NULL;

-- CreateIndex
CREATE INDEX "cycles_user_id_idx" ON "cycles"("user_id");

-- AddForeignKey
ALTER TABLE "cycles" ADD CONSTRAINT "cycles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
