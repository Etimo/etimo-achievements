export type PaginationOptions = {
  skip: number;
  take: number;
  orderBy: OrderByOption[];
  where?: Record<string, any>;
};

export type OrderByOption = [key: string, order: 'asc' | 'desc'];
