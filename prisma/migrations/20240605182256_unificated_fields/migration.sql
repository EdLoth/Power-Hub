/*
  Warnings:

  - You are about to drop the column `fullName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Administrator` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type_person` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TypePerson" AS ENUM ('ADMIN', 'USER', 'EMPLOYEE', 'MANAGER');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "fullName",
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL,
ADD COLUMN     "type_person" "TypePerson" NOT NULL;

-- DropTable
DROP TABLE "Administrator";
