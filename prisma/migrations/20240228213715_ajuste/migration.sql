/*
  Warnings:

  - You are about to drop the `Categorie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `CategorieId` on the `Product` table. All the data in the column will be lost.
  - Added the required column `CategoryId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Categorie_name_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Categorie";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

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
    "productsOnCartId" INTEGER NOT NULL,
    CONSTRAINT "Product_CategoryId_fkey" FOREIGN KEY ("CategoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("code", "costPrice", "description", "id", "isActive", "name", "productsOnCartId", "sellPrice") SELECT "code", "costPrice", "description", "id", "isActive", "name", "productsOnCartId", "sellPrice" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_code_key" ON "Product"("code");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
