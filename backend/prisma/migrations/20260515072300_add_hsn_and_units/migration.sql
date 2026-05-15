/*
  Warnings:

  - You are about to drop the column `basePrice` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "InvoiceItem" ADD COLUMN     "hsn" TEXT;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "basePrice",
ADD COLUMN     "gstSlab" INTEGER NOT NULL DEFAULT 18,
ADD COLUMN     "hsn" TEXT,
ADD COLUMN     "unit" TEXT NOT NULL DEFAULT 'PCS',
ADD COLUMN     "unitPrice" DOUBLE PRECISION NOT NULL DEFAULT 0;
