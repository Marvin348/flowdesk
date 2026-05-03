export const calcPercent = (value: number, total: number) =>
  total ? Math.round((value / total) * 100) : 0;
