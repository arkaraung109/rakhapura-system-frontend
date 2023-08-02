import { TableHeader } from "./TableHeader";

export class CustomPaginationResponse {
    elements: any[] = [];
    totalElements: number = 0;
    totalPages: number = 1;
    pageSize: number = 5;
    totalAnswered!: number;
    totalPassed!: number;
    totalModerated!: number;
    totalFailed!: number;
    tableHeader: TableHeader = new TableHeader();
}