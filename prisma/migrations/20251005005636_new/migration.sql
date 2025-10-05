-- DropIndex
DROP INDEX "public"."users_id_key";

-- AlterTable
ALTER TABLE "issues" ADD COLUMN     "assigneeAvatarUrl" TEXT,
ADD COLUMN     "assigneeName" TEXT,
ADD COLUMN     "creatorAvatarUrl" TEXT,
ADD COLUMN     "creatorName" TEXT,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
