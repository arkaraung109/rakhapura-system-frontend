import { StudentClass } from "./StudentClass";

export class PublicExamResult {
    id!: string;
    serialNo!: number;
    studentClass: StudentClass = new StudentClass();
}