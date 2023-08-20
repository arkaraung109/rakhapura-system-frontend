import { UserRole } from "./UserRole";

export class ApplicationUser {
    id!: number;
    firstName!: string;
    lastName!: string;
    loginUserName!: string;
    password!: string;
    oldPassword!: string;
    activeStatus!: boolean;
    role: UserRole = new UserRole();
}