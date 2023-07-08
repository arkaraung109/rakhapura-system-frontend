import { Class } from "./Class";
import { ExamTitle } from "./ExamTitle";
import { Student } from "./Student";

export class StudentClass {
    id!: string;
    regNo!: string;
    regSeqNo!: number;
    arrival!: boolean;
    createdTimestamp!: string;
    examTitle: ExamTitle = new ExamTitle();
    studentClass: Class = new Class();
    student: Student = new Student();
}