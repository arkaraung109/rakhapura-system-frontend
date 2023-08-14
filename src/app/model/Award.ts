import { Student } from "./Student";

export class Award {
    id!: number;
    award!: string;
    description!: string;
    eventDate!: string;
    student: Student = new Student();
}