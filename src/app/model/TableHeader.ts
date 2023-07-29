import { CustomExam } from "./CustomExam";

export class TableHeader {
    academicYear!: string;
    examTitle!: string;
    grade!: string;
    customExamList: CustomExam[] = [];
    examSubjectList: string[] = [];
    givenMarkList: string[] = [];
}