-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "token" VARCHAR(512),
ALTER COLUMN "contraseña" SET DATA TYPE VARCHAR(100);
