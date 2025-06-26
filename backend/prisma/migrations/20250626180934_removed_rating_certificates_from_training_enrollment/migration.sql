/*
  Warnings:

  - You are about to drop the column `certificate` on the `TrainingEnrollment` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `TrainingEnrollment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TrainingEnrollment" DROP COLUMN "certificate",
DROP COLUMN "rating";
