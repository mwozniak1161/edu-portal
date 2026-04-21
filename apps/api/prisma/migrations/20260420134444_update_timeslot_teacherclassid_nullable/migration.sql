-- DropForeignKey
ALTER TABLE "timeslots" DROP CONSTRAINT "timeslots_teacher_class_id_fkey";

-- AlterTable
ALTER TABLE "timeslots" ALTER COLUMN "teacher_class_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "timeslots" ADD CONSTRAINT "timeslots_teacher_class_id_fkey" FOREIGN KEY ("teacher_class_id") REFERENCES "teacher_classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
