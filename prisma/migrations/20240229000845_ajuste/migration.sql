/*
  Warnings:

  - You are about to drop the column `productsOnCartId` on the `Product` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "costPrice" INTEGER NOT NULL,
    "sellPrice" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "CategoryId" INTEGER NOT NULL,
    CONSTRAINT "Product_CategoryId_fkey" FOREIGN KEY ("CategoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("CategoryId", "code", "costPrice", "description", "id", "isActive", "name", "sellPrice") SELECT "CategoryId", "code", "costPrice", "description", "id", "isActive", "name", "sellPrice" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_code_key" ON "Product"("code");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
