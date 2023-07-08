import { Grade } from "./Grade";
import { AcademicYear } from "./AcademicYear";

export class Class {
    id!: number;
    name!: string;
    authorizedStatus!: boolean;
    authorizedUserId!: number;
    academicYear: AcademicYear = new AcademicYear();
    grade: Grade = new Grade();
}