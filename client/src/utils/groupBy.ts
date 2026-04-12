export const groupBy = <T, K extends string | number>(
  items: T[],
  getKey: (item: T) => K,
) => {
  const map = new Map<K, T[]>();
  for (const item of items) {
    const key = getKey(item);
    const bucket = map.get(key);
    if (bucket) bucket.push(item);
    else map.set(key, [item]);
  }
  return map;
};
