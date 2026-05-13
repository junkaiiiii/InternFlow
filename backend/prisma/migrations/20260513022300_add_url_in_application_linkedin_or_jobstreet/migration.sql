/*
  Warnings:

  - Added the required column `url` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "url" TEXT NOT NULL;
