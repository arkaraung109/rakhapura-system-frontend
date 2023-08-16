import { Class } from "./Class";
import { ExamTitle } from "./ExamTitle";
import { Hostel } from "./Hostel";
import { Student } from "./Student";

export class StudentClass {
    id!: string;
    regNo!: string;
    regSeqNo!: number;
    arrival!: boolean;
    createdTimestamp!: string;
    examTitle: ExamTitle = new ExamTitle();
    studentClass: Class = new Class();
    hostel!: Hostel;
    student: Student = new Student();
}