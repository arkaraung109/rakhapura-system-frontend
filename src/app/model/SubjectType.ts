import { Grade } from "./Grade";

export class SubjectType {
    id!: number;
    name!: string;
    authorizedStatus!: boolean;
    authorizedUserId!: number;
    grade: Grade = new Grade();
}