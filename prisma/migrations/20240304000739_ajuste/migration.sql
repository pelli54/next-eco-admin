/*
  Warnings:

  - Added the required column `contact` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `direction` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameClient` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Orders" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "nameClient" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "note" TEXT,
    "isDelivery" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Orders" ("code", "createdAt", "id", "status", "total", "updatedAt", "userId") SELECT "code", "createdAt", "id", "status", "total", "updatedAt", "userId" FROM "Orders";
DROP TABLE "Orders";
ALTER TABLE "new_Orders" RENAME TO "Orders";
CREATE UNIQUE INDEX "Orders_code_key" ON "Orders"("code");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
