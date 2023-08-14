import { AcademicYear } from "./AcademicYear";
import { ExamTitle } from "./ExamTitle";
import { SubjectType } from "./SubjectType";

export class Exam {
    id!: number;
    examDate!: string;
    time!: string;
    passMark!: number;
    markPercentage!: number;
    published!: boolean;
    authorizedStatus!: boolean;
    authorizedUserId!: number;
    academicYear: AcademicYear = new AcademicYear();
    examTitle: ExamTitle = new ExamTitle();
    subjectType: SubjectType = new SubjectType();
}