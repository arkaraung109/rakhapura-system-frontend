import { Exam } from "./Exam";
import { StudentClass } from "./StudentClass";

export class Attendance {
    id!: string;
    present!: boolean;
    createdTimestamp!: string;
    exam: Exam = new Exam();
    studentClass: StudentClass = new StudentClass();
}