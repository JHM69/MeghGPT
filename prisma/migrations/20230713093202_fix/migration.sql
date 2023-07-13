/*
  Warnings:

  - You are about to drop the column `thumbnile` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `bookId` on the `Star` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Star` table. All the data in the column will be lost.
  - Added the required column `thumbnail` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `givenById` to the `Star` table without a default value. This is not possible if the table is not empty.
  - Added the required column `givenToId` to the `Star` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Star` DROP FOREIGN KEY `Star_bookId_fkey`;

-- DropForeignKey
ALTER TABLE `Star` DROP FOREIGN KEY `Star_userId_fkey`;

-- AlterTable
ALTER TABLE `Book` DROP COLUMN `thumbnile`,
    ADD COLUMN `thumbnail` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Star` DROP COLUMN `bookId`,
    DROP COLUMN `userId`,
    ADD COLUMN `givenById` VARCHAR(191) NOT NULL,
    ADD COLUMN `givenToId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `Star_givenById_idx` ON `Star`(`givenById`);

-- CreateIndex
CREATE INDEX `Star_givenToId_idx` ON `Star`(`givenToId`);

-- AddForeignKey
ALTER TABLE `Star` ADD CONSTRAINT `Star_givenById_fkey` FOREIGN KEY (`givenById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Star` ADD CONSTRAINT `Star_givenToId_fkey` FOREIGN KEY (`givenToId`) REFERENCES `Book`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
