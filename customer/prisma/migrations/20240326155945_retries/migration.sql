/*
  Warnings:

  - You are about to drop the column `county` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `zip` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Customer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phoneNumber]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `countryId` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `defaultBilling` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `defaultShipping` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emails` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `region` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `regionId` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telephone` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `terms` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `autoSignIn` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `newsletter` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "county",
DROP COLUMN "notes",
DROP COLUMN "zip",
ADD COLUMN     "countryId" TEXT NOT NULL,
ADD COLUMN     "defaultBilling" BOOLEAN NOT NULL,
ADD COLUMN     "defaultShipping" BOOLEAN NOT NULL,
ADD COLUMN     "emails" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "region" TEXT NOT NULL,
ADD COLUMN     "regionId" INTEGER NOT NULL,
ADD COLUMN     "street" TEXT[],
ADD COLUMN     "telephone" TEXT NOT NULL,
ADD COLUMN     "terms" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "phone",
ADD COLUMN     "autoSignIn" BOOLEAN NOT NULL,
ADD COLUMN     "lockedUntil" TIMESTAMP(3),
ADD COLUMN     "newsletter" BOOLEAN NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ADD COLUMN     "retryCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "CustomAttribute" (
    "id" TEXT NOT NULL,
    "attribute" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomAttribute_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_phoneNumber_key" ON "Customer"("phoneNumber");

-- AddForeignKey
ALTER TABLE "CustomAttribute" ADD CONSTRAINT "CustomAttribute_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
