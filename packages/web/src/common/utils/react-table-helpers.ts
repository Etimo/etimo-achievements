import { Row } from 'react-table';

export const insensitiveCompare = (rowA: Row, rowB: Row, columnId: string, desc?: boolean) => {
  const valueA = rowA.values[columnId].toLowerCase();
  const valueB = rowB.values[columnId].toLowerCase();

  if (desc) {
    return valueA.localeCompare(valueB) > 0 ? 1 : -1;
  }
  return valueB.localeCompare(valueA) > 0 ? -1 : 1;
};
