-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerifyCode" TEXT,
ADD COLUMN     "emailVerifyExpires" TIMESTAMP(3),
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;
