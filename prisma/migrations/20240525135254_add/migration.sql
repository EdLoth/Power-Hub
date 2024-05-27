/*
  Warnings:

  - Added the required column `situacao` to the `Administrator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `situacao` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Administrator" ADD COLUMN     "situacao" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "situacao" BOOLEAN NOT NULL;
