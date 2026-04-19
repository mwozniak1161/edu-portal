export interface Class {
  id: string;
  name: string;
  gradeLevel: number;
  section: string;
  academicYear: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClassCreateDTO {
  name: string;
  gradeLevel: number;
  section: string;
  academicYear: string;
}
