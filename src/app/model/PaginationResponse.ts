export class PaginationResponse {
    slice() {
      throw new Error('Method not implemented.');
    }
    elements: any[] = [];
    totalElements: number = 0;
    totalPages: number = 1;
    pageSize: number = 5;
}