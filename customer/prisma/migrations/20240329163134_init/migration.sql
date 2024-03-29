/*
  Warnings:

  - Added the required column `defaultBilling` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `defaultShipping` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "defaultBilling" TEXT NOT NULL,
ADD COLUMN     "defaultShipping" TEXT NOT NULL;
