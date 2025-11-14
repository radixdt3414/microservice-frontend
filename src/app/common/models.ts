export interface PaginationPayload {
    PageLimit: number;
    PageIndex: number;
    SortBy?: string | null;
    SortOrder?: 'asc' | 'desc';
}

export interface PaginationResponse<T> {
    data: T;
    totalRecords: number;
    pageLimit: number;
    pageCount: number;
    pageIndex: number;

}