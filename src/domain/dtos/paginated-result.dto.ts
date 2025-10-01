export class PaginatedResultDto<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  order: string;
}
