export const getMaxBy = <T>(
  items: T[],
  getValue: (item: T) => number,
): T | null => {
  if (items.length === 0) return null;

  return items.reduce((best, current) => {
    return getValue(current) > getValue(best) ? current : best;
  });
};
