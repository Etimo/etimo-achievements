export const formatNumber = Intl.NumberFormat('sv-SE').format;

export function isNumber(str: any) {
  const strValue = str.toString();
  const includesHyphen = strValue.substring(1).includes('-');
  const isNaN = Number.isNaN(parseInt(strValue));
  return !includesHyphen && !isNaN;
}
