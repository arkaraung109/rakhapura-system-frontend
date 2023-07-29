import { Attendance } from "./Attendance";
import { ExamSubject } from "./ExamSubject";

export class StudentExam {
    id!: string;
    mark!: number;
    pass!: boolean;
    createdTimestamp!: string;
    examSubject: ExamSubject = new ExamSubject();
    attendance: Attendance = new Attendance();
}