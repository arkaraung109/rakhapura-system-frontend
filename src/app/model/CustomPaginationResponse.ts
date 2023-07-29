import { TableHeader } from "./TableHeader";

export class CustomPaginationResponse {
    elements: any[] = [];
    totalElements: number = 0;
    totalPages: number = 1;
    pageSize: number = 5;
    totalAnswered!: number;
    totalNormalPassed!: number;
    totalModeratePassed!: number;
    totalFailed!: number;
    tableHeader: TableHeader = new TableHeader();
}