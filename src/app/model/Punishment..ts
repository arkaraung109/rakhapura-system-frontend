import { Student } from "./Student";

export class Punishment {
    id!: number;
    punishment!: string;
    description!: string;
    eventDate!: string;
    startDate!: string;
    endDate!: string;
    student: Student = new Student();
}