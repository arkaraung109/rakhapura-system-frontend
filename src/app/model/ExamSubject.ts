import { Exam } from "./Exam";
import { Subject } from "./Subject";

export class ExamSubject {
    id!: number;
    passMark!: number;
    markPercentage!: number;
    authorizedStatus!: boolean;
    authorizedUserId!: number;
    exam: Exam = new Exam();
    subject: Subject = new Subject();
}