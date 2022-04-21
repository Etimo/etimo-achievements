import { Row } from 'react-table';

export const insensitiveSort = (rowA: Row, rowB: Row, columnId: string, desc?: boolean) => {
  const valueA = rowA.values[columnId].toLowerCase();
  const valueB = rowB.values[columnId].toLowerCase();

  if (desc) {
    return valueA.localeCompare(valueB) > 0 ? 1 : -1;
  }
  return valueB.localeCompare(valueA) > 0 ? -1 : 1;
};

export const numberSort = (rowA: Row, rowB: Row, columnId: string, desc?: boolean) => {
  const valueA = parseInt(rowA.values[columnId].replace(/[^0-9]/g, ''));
  const valueB = parseInt(rowB.values[columnId].replace(/[^0-9]/g, ''));

  if (valueA === valueB) return 0;

  if (desc) {
    return valueA > valueB ? 1 : -1;
  }
  return valueA > valueB ? -1 : 1;
};
