import { Attendance } from "./Attendance";
import { ExamResult } from "./ExamResult";
import { OverAllMark } from "./OverAllMark";

export class ResultResponse {
    attendance: Attendance = new Attendance();
    examResultList: ExamResult[] = [];
    overAllMark: OverAllMark = new OverAllMark();
    status!: string;
    attendedExamList: Attendance[] = [];
}