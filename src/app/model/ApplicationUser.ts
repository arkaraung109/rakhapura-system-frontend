import { UserRole } from "./UserRole";

export class ApplicationUser {
    id!: number;
    firstName!: string;
    lastName!: string;
    loginUserName!: string;
    role: UserRole = new UserRole();
}