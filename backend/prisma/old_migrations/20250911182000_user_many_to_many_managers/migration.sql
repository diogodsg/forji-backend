-- Migrate from one-to-many managerId to many-to-many join table

-- 1) Create join table for managers <-> reports
CREATE TABLE IF NOT EXISTS "public"."_UserManagers" (
  "A" INTEGER NOT NULL, -- manager id
  "B" INTEGER NOT NULL, -- report id
  CONSTRAINT "_UserManagers_AB_unique" UNIQUE ("A","B"),
  CONSTRAINT "_UserManagers_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "_UserManagers_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 2) Optional indexes
CREATE INDEX IF NOT EXISTS "_UserManagers_A_index" ON "public"."_UserManagers"("A");
CREATE INDEX IF NOT EXISTS "_UserManagers_B_index" ON "public"."_UserManagers"("B");

-- 3) Drop old managerId column and constraint if existed
ALTER TABLE "public"."User" DROP CONSTRAINT IF EXISTS "User_managerId_fkey";
DROP INDEX IF EXISTS "User_managerId_idx";
ALTER TABLE "public"."User" DROP COLUMN IF EXISTS "managerId";
