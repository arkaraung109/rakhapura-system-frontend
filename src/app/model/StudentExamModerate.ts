import { Attendance } from "./Attendance";
import { ExamSubject } from "./ExamSubject";

export class StudentExamModerate {
    id!: string;
    mark!: number;
    createdTimestamp!: string;
    examSubject: ExamSubject = new ExamSubject();
    attendance: Attendance = new Attendance();
}