-- Email accounts authenticate with a bcrypt password hash. Nullable so
-- WeChat/phone-only accounts (which never set a password) stay valid.
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "passwordHash" TEXT;
