/*
  Warnings:

  - The primary key for the `issues` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `tokenReward` on the `issues` table. All the data in the column will be lost.
  - Added the required column `rewardAmount` to the `issues` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `issues` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "IssueStatus" ADD VALUE 'FUNDED';

-- DropForeignKey
ALTER TABLE "public"."contributions" DROP CONSTRAINT "contributions_issueId_fkey";

-- AlterTable
ALTER TABLE "contributions" ALTER COLUMN "issueId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "issues" DROP CONSTRAINT "issues_pkey",
DROP COLUMN "tokenReward",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "githubUrl" TEXT,
ADD COLUMN     "organizationWallet" TEXT,
ADD COLUMN     "rewardAmount" DECIMAL(18,9) NOT NULL,
ADD COLUMN     "tokenMintAddress" TEXT,
ADD COLUMN     "tokenType" TEXT,
ADD COLUMN     "transactionSignature" TEXT,
ADD COLUMN     "treasuryWallet" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "githubIssueId" DROP NOT NULL,
ALTER COLUMN "number" DROP NOT NULL,
ALTER COLUMN "repoId" DROP NOT NULL,
ADD CONSTRAINT "issues_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "issues_id_seq";

-- AddForeignKey
ALTER TABLE "contributions" ADD CONSTRAINT "contributions_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "issues"("id") ON DELETE CASCADE ON UPDATE CASCADE;
