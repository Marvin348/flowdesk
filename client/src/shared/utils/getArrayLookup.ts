export const getArrayLookup = <T extends { id: string }>(array: T[]) =>
  new Map(array.map((arr) => [arr.id, arr]));
