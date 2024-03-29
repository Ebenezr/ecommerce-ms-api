-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "defaultBilling" DROP NOT NULL,
ALTER COLUMN "defaultShipping" DROP NOT NULL;
