export class PaginatedResultDto<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  orderBy: string;
  orderDir: 'ASC' | 'DESC';
}
