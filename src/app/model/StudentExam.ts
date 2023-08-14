import { Attendance } from "./Attendance";
import { ExamSubject } from "./ExamSubject";

export class StudentExam {
    id!: string;
    mark!: number;
    pass!: boolean;
    examSubject: ExamSubject = new ExamSubject();
    attendance: Attendance = new Attendance();
}