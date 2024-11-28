/*
  Warnings:

  - The values [MIRROLEX] on the enum `cameras_classificacao` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `cameras` MODIFY `classificacao` ENUM('DLSR', 'MIRRORLESS', 'COMPACTA') NOT NULL DEFAULT 'DLSR';
