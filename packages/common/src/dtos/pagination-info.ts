export type PaginationInfo = {
  items: number;
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
  firstLink?: string;
  nextLink?: string;
  prevLink?: string;
  lastLink?: string;
  cursor?: string;
};
