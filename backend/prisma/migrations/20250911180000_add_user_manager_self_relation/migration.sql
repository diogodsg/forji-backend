-- Add managerId column to User for self-relation (who manages whom)
ALTER TABLE "public"."User" ADD COLUMN IF NOT EXISTS "managerId" INTEGER;

-- Add foreign key constraint referencing User(id)
ALTER TABLE "public"."User"
  ADD CONSTRAINT "User_managerId_fkey"
  FOREIGN KEY ("managerId") REFERENCES "public"."User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- Optional index to query by managerId efficiently
CREATE INDEX IF NOT EXISTS "User_managerId_idx" ON "public"."User"("managerId");
