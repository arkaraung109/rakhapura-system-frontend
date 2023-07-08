import { Region } from "./Region";

export class Student {
    id!: string;
    regDate!: string;
    name!: string;
    dob!: string;
    sex!: string;
    nationality!: string;
    nrc!: string;
    fatherName!: string;
    motherName!: string;
    address!: string;
    monasteryName!: string;
    monasteryHeadmaster!: string;
    monasteryTownship!: string;
    createdTimestamp!: string;
    region: Region = new Region();
}