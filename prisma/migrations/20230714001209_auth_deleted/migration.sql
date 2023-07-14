/*
  Warnings:

  - You are about to drop the column `userId` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the `Star` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `addedBy` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timestamp` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Book` DROP FOREIGN KEY `Book_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Star` DROP FOREIGN KEY `Star_givenById_fkey`;

-- DropForeignKey
ALTER TABLE `Star` DROP FOREIGN KEY `Star_givenToId_fkey`;

-- AlterTable
ALTER TABLE `Book` DROP COLUMN `userId`,
    ADD COLUMN `addedBy` VARCHAR(191) NOT NULL,
    ADD COLUMN `timestamp` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `Star`;

-- DropTable
DROP TABLE `User`;
