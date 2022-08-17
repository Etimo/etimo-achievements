export type PaginationOptions = {
  skip: number;
  take: number;
  orderBy: OrderByOption[];
  filters?: Record<string, any>;
};

export type OrderByOption = [key: string, order: 'asc' | 'desc'];
