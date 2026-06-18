-- Adds an email column to User so H5 sign-up doesn't depend on SMS.
-- Nullable + UNIQUE: existing rows stay valid (NULL is allowed in unique
-- constraints), new email signups get their own row, and a future user
-- can link a phone to an email-registered account without conflict.
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "email" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
